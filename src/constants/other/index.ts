export const MOBILE_BREAKPOINT = 768;

/** Orders at or above this subtotal ship for free; below it a flat fee applies. Manat. */
export const FREE_SHIPPING_FROM = 40;
export const SHIPPING_FEE = 4;

/** How long one author stays in the home spotlight before the next one turns in. */
export const SPOTLIGHT_INTERVAL_MS = 9000;

export const CATALOG_PAGE_SIZE = 12;

/** How long the fetched catalogue is reused before it is read again. */
export const CATALOGUE_TTL_MS = 5 * 60_000;

/** A signed-in reader's cart and favourites are written to the server this long after the last change. */
export const SHELF_SYNC_DELAY_MS = 700;

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
    ORDERS: "orders",
    PROFILE: "profile",
    ADDRESSES: "addresses",
} as const;
