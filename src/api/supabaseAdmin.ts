import {RealtimeClient} from "@supabase/realtime-js";
import {StorageClient} from "@supabase/storage-js";
import {authedFetch, getAccessToken, SUPABASE_KEY, SUPABASE_URL, supabase} from "@/api/supabase";

/**
 * The parts of Supabase only the admin panel uses: Storage for uploaded pictures and Realtime for the live order feed.
 * This module is imported by admin code alone, so the storefront never downloads it.
 */
export const storage = new StorageClient(`${SUPABASE_URL}/storage/v1`, {apikey: SUPABASE_KEY}, authedFetch);

export const realtime = new RealtimeClient(`${SUPABASE_URL.replace(/^http/, "ws")}/realtime/v1`, {
    params: {apikey: SUPABASE_KEY},
    accessToken: getAccessToken,
});

// Keep the socket's token in step with the session, as `createClient` does.
supabase.auth.onAuthStateChange((event, session) => {
    if (event === "TOKEN_REFRESHED" || event === "SIGNED_IN") void realtime.setAuth(session?.access_token);
    else if (event === "SIGNED_OUT") void realtime.setAuth();
});
