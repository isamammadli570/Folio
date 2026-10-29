/**
 * Paintings shown in a cover's arched window, by book id. All are public domain, cropped and toned by hand into
 * public/covers. A trial for now: once every book has one, the path moves to the `cover_image` column.
 */
export const COVER_ART: Partial<Record<string, string>> = {
    "the-republic": "/covers/the-republic.webp",
    "crime-and-punishment": "/covers/crime-and-punishment.webp",
};
