import {unwrap} from "@/api/client";
import {supabase} from "@/api/supabase";
import type {CartLine} from "@/helpers/cart";

/** The cart and favourites a signed-in reader saved on the server. */
export const getSavedShelf = async (): Promise<{cart: CartLine[]; favorites: string[]}> => {
    const [cart, favorites] = await Promise.all([
        supabase.from("cart_items").select("book_id, quantity").order("updated_at").returns<{book_id: string; quantity: number}[]>(),
        supabase.from("favorites").select("book_id").order("created_at", {ascending: false}).returns<{book_id: string}[]>(),
    ]);
    return {
        cart: unwrap(cart).map((row) => ({bookId: row.book_id, quantity: row.quantity})),
        favorites: unwrap(favorites).map((row) => row.book_id),
    };
};

/** Makes the server cart exactly `lines`: upserts what is there, deletes what is gone. */
export const replaceCart = async (userId: string, lines: CartLine[]) => {
    const ids = lines.map((line) => line.bookId);
    const remove = supabase.from("cart_items").delete().eq("user_id", userId);
    const {error: deleteError} = await (ids.length ? remove.not("book_id", "in", `(${ids.map((id) => `"${id}"`).join(",")})`) : remove);
    if (deleteError) unwrap({data: null, error: deleteError});
    if (lines.length === 0) return;
    const now = new Date().toISOString();
    const {error} = await supabase
        .from("cart_items")
        .upsert(lines.map((line) => ({user_id: userId, book_id: line.bookId, quantity: line.quantity, updated_at: now})));
    if (error) unwrap({data: null, error});
};

/** Makes the server favourites exactly `ids`. */
export const replaceFavorites = async (userId: string, ids: string[]) => {
    const remove = supabase.from("favorites").delete().eq("user_id", userId);
    const {error: deleteError} = await (ids.length ? remove.not("book_id", "in", `(${ids.map((id) => `"${id}"`).join(",")})`) : remove);
    if (deleteError) unwrap({data: null, error: deleteError});
    if (ids.length === 0) return;
    const {error} = await supabase
        .from("favorites")
        .upsert(ids.map((bookId) => ({user_id: userId, book_id: bookId})), {onConflict: "user_id,book_id", ignoreDuplicates: true});
    if (error) unwrap({data: null, error});
};
