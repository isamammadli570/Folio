/** Link-preview (Open Graph) tags, shared by middleware.ts on the server. No browser or React code in here. */

export type ShareInfo = {
    title: string;
    description: string;
    /** Absolute URL of a 1200×630 image. */
    image: string;
    /** Absolute URL of the page. */
    url: string;
    type?: "website" | "book" | "profile";
};

const escapeHtml = (text: string): string =>
    text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** A description short enough for previews: whole words, at most `max` characters. */
export const clip = (text: string, max = 180): string => {
    const clean = text.replace(/\s+/g, " ").trim();
    if (clean.length <= max) return clean;
    return `${clean.slice(0, max).replace(/\s+\S*$/, "")}…`;
};

export const shareTags = ({title, description, image, url, type = "website"}: ShareInfo): string => {
    const [t, d, i, u] = [title, clip(description), image, url].map(escapeHtml);
    return [
        `<title>${t}</title>`,
        `<meta name="description" content="${d}"/>`,
        `<meta property="og:type" content="${type}"/>`,
        `<meta property="og:site_name" content="Folio"/>`,
        `<meta property="og:locale" content="az_AZ"/>`,
        `<meta property="og:title" content="${t}"/>`,
        `<meta property="og:description" content="${d}"/>`,
        `<meta property="og:url" content="${u}"/>`,
        `<meta property="og:image" content="${i}"/>`,
        `<meta property="og:image:width" content="1200"/>`,
        `<meta property="og:image:height" content="630"/>`,
        `<meta name="twitter:card" content="summary_large_image"/>`,
    ].join("\n    ");
};

/** Swaps the block between the `share:start` and `share:end` comments of index.html; without the markers, changes nothing. */
export const replaceShareBlock = (html: string, tags: string): string =>
    html.replace(/<!-- share:start[\s\S]*?<!-- share:end -->/, `<!-- share:start -->\n    ${tags}\n    <!-- share:end -->`);
