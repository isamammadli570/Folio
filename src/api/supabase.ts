import {createClient} from "@supabase/supabase-js";
import {ENV} from "@/lib/env";

/** The one Supabase client. The anon key is public; row-level security in the database decides what it may read and write. */
export const supabase = createClient(ENV.supabaseUrl, ENV.supabaseAnonKey, {
    auth: {persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: "folio.auth"},
});
