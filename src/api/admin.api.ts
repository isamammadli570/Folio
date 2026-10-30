import {getCatalogue, invalidateCatalogue, unwrap} from "@/api/client";
import {supabase} from "@/api/supabase";
import {ORDER_COLUMNS, type OrderRow} from "@/api/rows";
import type {Author, Book, Order, OrderStatus} from "@/api/types";
import {mapOrderRow} from "@/helpers/rows";
import {toAuthorRow, toBookRow} from "@/helpers/admin";

const fail = (error: Parameters<typeof unwrap>[0]["error"]) => {
    if (error) unwrap({data: null, error});
};

/** "admin" or "customer" for the signed-in reader; null for a guest. */
export const getMyRole = async (): Promise<"admin" | "customer" | null> => {
    const {data: auth} = await supabase.auth.getSession();
    const userId = auth.session?.user.id;
    if (!userId) return null;
    const {data, error} = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle<{role: string}>();
    if (error) return "customer";
    return data?.role === "admin" ? "admin" : "customer";
};

/** Creates or replaces a book. A new one goes to the end of the catalogue. */
export const saveBook = async (book: Book, isNew: boolean) => {
    const {books} = await getCatalogue();
    const index = books.findIndex((item) => item.id === book.id);
    if (isNew && index !== -1) throw new Error("DUPLICATE_ID");
    const {error} = await supabase.from("books").upsert(toBookRow(book, index === -1 ? books.length : index));
    fail(error);
    invalidateCatalogue();
};

/** Books that were ordered cannot be deleted (order history points at them); the database refuses with a foreign-key error. */
export const deleteBook = async (bookId: string) => {
    const {error} = await supabase.from("books").delete().eq("id", bookId);
    fail(error);
    invalidateCatalogue();
};

export const saveAuthor = async (author: Author, isNew: boolean) => {
    const {authors} = await getCatalogue();
    const index = authors.findIndex((item) => item.id === author.id);
    if (isNew && index !== -1) throw new Error("DUPLICATE_ID");
    const {error} = await supabase.from("authors").upsert(toAuthorRow(author, index === -1 ? authors.length : index));
    fail(error);
    invalidateCatalogue();
};

/** An author with books cannot be deleted; their books must go first. */
export const deleteAuthor = async (authorId: string) => {
    const {error} = await supabase.from("authors").delete().eq("id", authorId);
    fail(error);
    invalidateCatalogue();
};

/** Every order in the shop, newest first (admins only; RLS returns nothing to anyone else). */
export const getAllOrders = async (): Promise<Order[]> => {
    const response = await supabase.from("orders").select(ORDER_COLUMNS).order("created_at", {ascending: false}).returns<OrderRow[]>();
    return unwrap(response).map(mapOrderRow);
};

export const updateOrderStatus = async ({orderId, status}: {orderId: string; status: OrderStatus}) => {
    const {error} = await supabase.from("orders").update({status}).eq("id", orderId);
    fail(error);
};

export const getCustomerCount = async (): Promise<number> => {
    const {count, error} = await supabase.from("profiles").select("id", {count: "exact", head: true}).eq("role", "customer");
    fail(error);
    return count ?? 0;
};

export type MediaFolder = "covers" | "authors" | "scenes";

/** Uploads an image to the public `media` bucket and returns its URL. A fresh name each time, so caches never show the old one. */
export const uploadMedia = async (file: File, folder: MediaFolder, name: string): Promise<string> => {
    const extension = file.type === "image/png" ? "png" : file.type === "image/jpeg" ? "jpg" : "webp";
    const path = `${folder}/${name}-${Date.now().toString(36)}.${extension}`;
    const {error} = await supabase.storage.from("media").upload(path, file, {contentType: file.type, cacheControl: "31536000"});
    if (error) throw error;
    return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
};
