import {unwrap} from "@/api/client";
import {supabase} from "@/api/supabase";
import type {Language} from "@/i18n/resources";

export type Subscriber = {id: string; email: string; language: Language; createdAt: string};

type SubscriberRow = {id: string; email: string; language: Language; created_at: string};

/** "subscribed" for a new address, "exists" when it was already on the list (Postgres unique violation). */
export const subscribe = async ({email, language}: {email: string; language: Language}): Promise<"subscribed" | "exists"> => {
    // No `.select()` after the insert: guests may add a row but not read the list back.
    const {error} = await supabase.from("newsletter_subscribers").insert({email: email.trim().toLowerCase(), language});
    if (error?.code === "23505") return "exists";
    if (error) unwrap({data: null, error});
    return "subscribed";
};

/** The whole list, newest first (admins only). */
export const getSubscribers = async (): Promise<Subscriber[]> => {
    const response = await supabase.from("newsletter_subscribers").select("id, email, language, created_at").order("created_at", {ascending: false}).returns<SubscriberRow[]>();
    return unwrap(response).map((row) => ({id: row.id, email: row.email, language: row.language, createdAt: row.created_at}));
};

export const removeSubscriber = async (id: string) => {
    const {error} = await supabase.from("newsletter_subscribers").delete().eq("id", id);
    if (error) unwrap({data: null, error});
};
