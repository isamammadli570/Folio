// Vercel Cron target (see "crons" in vercel.json). Supabase pauses a free-plan project after a week without database
// activity, and a paused project's host stops resolving, so the whole store loads empty. One tiny read a day keeps it awake.
export async function GET(request: Request): Promise<Response> {
    // When CRON_SECRET is set in Vercel, only the cron (which sends it as a bearer token) may call this.
    const secret = process.env.CRON_SECRET;
    if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
        return new Response("Unauthorized", {status: 401});
    }

    const base = (process.env.VITE_SUPABASE_URL ?? "").replace(/\/+$/, "").replace(/\/rest\/v1$/, "");
    const key = process.env.VITE_SUPABASE_ANON_KEY ?? "";
    if (!base || !key) return Response.json({ok: false, error: "Supabase env vars missing"}, {status: 500});

    try {
        const response = await fetch(`${base}/rest/v1/books?select=id&limit=1`, {
            headers: {apikey: key, Authorization: `Bearer ${key}`},
            signal: AbortSignal.timeout(10_000),
        });
        return Response.json({ok: response.ok, status: response.status}, {status: response.ok ? 200 : 502});
    } catch (error) {
        return Response.json({ok: false, error: String(error)}, {status: 502});
    }
}
