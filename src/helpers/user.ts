import type {User} from "@supabase/supabase-js";

export type UserIdentity = {name: string; email: string; initials: string; avatar: string};

/**
 * What the interface shows for a signed-in reader. Email sign-ups store `full_name`; Google adds `name` and a photo in
 * `avatar_url` (or `picture`). Initials come from the name, or the email when there is no name.
 */
export const userIdentity = (user: User | null | undefined): UserIdentity => {
    const meta = (user?.user_metadata ?? {}) as Record<string, unknown>;
    const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");
    const name = text(meta.full_name) || text(meta.name);
    const email = user?.email ?? "";
    const initials = (name ? name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("") : email[0] ?? "?").toLocaleUpperCase();
    return {name, email, initials, avatar: text(meta.avatar_url) || text(meta.picture)};
};
