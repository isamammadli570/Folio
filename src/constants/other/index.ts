export const MOBILE_BREAKPOINT = 768;

/** Orders at or above this subtotal ship for free; below it a flat fee applies. Manat. */
export const FREE_SHIPPING_FROM = 40;
export const SHIPPING_FEE = 4;

/** How long one author stays in the home spotlight before the next one turns in. */
export const SPOTLIGHT_INTERVAL_MS = 9000;

export const CATALOG_PAGE_SIZE = 12;

/** Simulated latency of the local data layer, so loading states are real until Supabase replaces it. */
export const LOCAL_API_DELAY_MS = 260;

export const STORAGE_KEYS = {
    CART: "folio.cart",
    FAVORITES: "folio.favorites",
    LANGUAGE: "lang",
} as const;

/** Query-key roots shared between hooks. */
export const QUERY_KEYS = {
    BOOKS: "books",
    BOOK: "book",
    AUTHORS: "authors",
    AUTHOR: "author",
    CATEGORY_COUNTS: "categoryCounts",
} as const;
