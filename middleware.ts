// Vercel Routing Middleware. Chat apps and social sites read a shared link's <head> without running JavaScript, so this
// runs on the server for book and author pages only: it fetches the built index.html, looks the book or author up in
// Supabase and swaps the default share tags for the page's own title, text and preview image (public/og/…).
// The page itself is unchanged; the SPA boots as usual. Any failure falls back to the default tags.
// Only link-preview bots and crawlers need this: a reader's browser goes straight to the static index.html, so their
// first byte never waits on the two lookups below.
import {replaceShareBlock, shareTags, type ShareInfo} from "./src/helpers/share.js";

export const config = {
    // Only clean ids: /authors/plato.webp and other files never reach this code.
    matcher: ["/books/:id([a-z0-9-]+)", "/authors/:id([a-z0-9-]+)"],
};

/** Chat apps, social sites and search engines that read Open Graph tags without running JavaScript. */
const PREVIEW_BOTS = /bot|crawl|spider|preview|facebookexternalhit|meta-external|whatsapp|telegram|slack|discord|linkedin|skype|vkshare|pinterest|embedly|quora|outbrain|redditbot|tumblr|viber|snapchat|line\/|kakaotalk|google-inspectiontool|bingpreview|yandex|baidu|duckduck|applebot|petalbot|iframely|mastodon|bluesky|okhttp|curl|wget|python-requests/i;

/** Lets the request continue to its usual destination (what `next()` from @vercel/functions returns). */
const passThrough = () => new Response(null, {headers: {"x-middleware-next": "1"}});

type Localized = {az: string};
type BookRow = {id: string; title: Localized; description: Localized; author: {name: Localized} | null};
type AuthorRow = {id: string; name: Localized; bio: Localized; movement: Localized; portrait: string | null};

const supabase = async <TRow>(path: string): Promise<TRow | null> => {
    const base = (process.env.VITE_SUPABASE_URL ?? "").replace(/\/+$/, "").replace(/\/rest\/v1$/, "");
    const key = process.env.VITE_SUPABASE_ANON_KEY ?? "";
    if (!base || !key) return null;
    const response = await fetch(`${base}/rest/v1/${path}`, {headers: {apikey: key, Authorization: `Bearer ${key}`}});
    if (!response.ok) return null;
    const rows = (await response.json()) as TRow[];
    return rows[0] ?? null;
};

const describe = async (kind: string, id: string, origin: string): Promise<ShareInfo | null> => {
    const url = `${origin}/${kind}/${id}`;
    if (kind === "books") {
        const book = await supabase<BookRow>(`books?id=eq.${encodeURIComponent(id)}&select=id,title,description,author:authors(name)`);
        if (!book) return null;
        const author = book.author?.name.az;
        return {
            title: `${book.title.az}${author ? ` · ${author}` : ""} — Folio`,
            description: book.description.az,
            image: `${origin}/og/books/${book.id}.jpg`,
            url,
            type: "book",
        };
    }
    const author = await supabase<AuthorRow>(`authors?id=eq.${encodeURIComponent(id)}&select=id,name,bio,movement,portrait`);
    if (!author) return null;
    return {
        title: `${author.name.az} — Folio`,
        description: `${author.movement.az}. ${author.bio.az}`,
        image: author.portrait ? `${origin}/og/authors/${author.id}.jpg` : `${origin}/og/default.jpg`,
        url,
        type: "profile",
    };
};

export default async function middleware(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (!PREVIEW_BOTS.test(request.headers.get("user-agent") ?? "")) return passThrough();
    const [, kind = "", id = ""] = url.pathname.split("/");
    // The page and the record are fetched side by side, not one after the other.
    const [page, info] = await Promise.all([
        fetch(new URL("/index.html", url)).then((response) => response.text()),
        describe(kind, id, url.origin).catch(() => null),
    ]);
    // Without a record the default tags stay; the page works either way.
    const html = info ? replaceShareBlock(page, shareTags(info)) : page;
    // Not cached at the edge: index.html names this deployment's hashed assets, and an old copy would break after a deploy.
    return new Response(html, {status: 200, headers: {"content-type": "text/html; charset=utf-8", "cache-control": "no-cache"}});
}
