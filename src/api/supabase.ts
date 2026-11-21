import {AuthClient} from "@supabase/auth-js";
import {PostgrestClient} from "@supabase/postgrest-js";
import {ENV} from "@/lib/env";

/**
 * The Supabase client, assembled from the two parts the storefront uses: auth and the database (PostgREST).
 * `createClient` would also bundle Realtime, Storage and Functions (about 80 kB) into every page; the admin panel loads
 * those on its own (see `api/supabaseAdmin`). The anon key is public; row-level security decides what it may do.
 */
const baseUrl = ENV.supabaseUrl.replace(/\/+$/, "");
const key = ENV.supabaseAnonKey;
const clientInfo = {"X-Client-Info": "supabase-js/lean; runtime=web"};

const auth = new AuthClient({
    url: `${baseUrl}/auth/v1`,
    headers: {Authorization: `Bearer ${key}`, apikey: key, ...clientInfo},
    storageKey: "folio.auth",
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "implicit",
});

/** The signed-in reader's token, or the anon key for a guest. */
export const getAccessToken = async (): Promise<string> => {
    const {data} = await auth.getSession();
    return data.session?.access_token ?? key;
};

/** Every request carries the reader's token, so row-level security sees who is asking. */
export const authedFetch: typeof fetch = async (input, init) => {
    const token = await getAccessToken();
    const headers = new Headers(init?.headers);
    if (!headers.has("apikey")) headers.set("apikey", key);
    if (!headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);
    return fetch(input, {...init, headers});
};

/** Public reads only (the catalogue): the anon key at once, without waiting for the stored session to be read or refreshed. */
const anonFetch: typeof fetch = (input, init) => {
    const headers = new Headers(init?.headers);
    headers.set("apikey", key);
    headers.set("Authorization", `Bearer ${key}`);
    return fetch(input, {...init, headers});
};

const rest = new PostgrestClient(`${baseUrl}/rest/v1`, {headers: clientInfo, fetch: authedFetch});
const publicRest = new PostgrestClient(`${baseUrl}/rest/v1`, {headers: clientInfo, fetch: anonFetch});

export const supabase = {
    auth,
    from: (relation: string) => rest.from(relation),
    rpc: rest.rpc.bind(rest) as PostgrestClient["rpc"],
};

/** The same database for data every visitor may read; see `anonFetch`. */
export const publicDb = {
    from: (relation: string) => publicRest.from(relation),
};

export const SUPABASE_URL = baseUrl;
export const SUPABASE_KEY = key;
