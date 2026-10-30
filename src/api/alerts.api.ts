import {unwrap} from "@/api/client";
import {supabase} from "@/api/supabase";
import type {Language} from "@/i18n/resources";

export type StockAlert = {id: string; bookId: string; email: string; language: Language; createdAt: string};

type StockAlertRow = {id: string; book_id: string; email: string; language: Language; created_at: string};

/** "added" for a new request, "exists" when this address already waits for this book. */
export const requestStockAlert = async ({bookId, email, language}: {bookId: string; email: string; language: Language}): Promise<"added" | "exists"> => {
    // No `.select()`: guests may add a request but not read the list.
    const {error} = await supabase.from("stock_alerts").insert({book_id: bookId, email: email.trim().toLowerCase(), language});
    if (error?.code === "23505") return "exists";
    if (error) unwrap({data: null, error});
    return "added";
};

/** Everyone waiting for books to come back, newest first (admins only). */
export const getStockAlerts = async (): Promise<StockAlert[]> => {
    const response = await supabase.from("stock_alerts").select("id, book_id, email, language, created_at").order("created_at", {ascending: false}).returns<StockAlertRow[]>();
    return unwrap(response).map((row) => ({id: row.id, bookId: row.book_id, email: row.email, language: row.language, createdAt: row.created_at}));
};

export const removeStockAlert = async (id: string) => {
    const {error} = await supabase.from("stock_alerts").delete().eq("id", id);
    if (error) unwrap({data: null, error});
};
