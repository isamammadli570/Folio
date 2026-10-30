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
    THEME: "folio.theme",
    FAVORITE_HINT: "folio.favoriteHint",
    RECENT: "folio.recent",
} as const;

/** Set in sessionStorage while the reader is away at Google, so the site can welcome them back. */
export const OAUTH_PENDING_KEY = "folio.oauthPending";

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
    ROLE: "role",
    ADMIN_ORDERS: "adminOrders",
    CUSTOMERS: "customers",
    SUBSCRIBERS: "subscribers",
    REVIEWS: "reviews",
    RATINGS: "ratings",
    CAN_REVIEW: "canReview",
    STOCK_ALERTS: "stockAlerts",
    PROMO_CODES: "promoCodes",
    ADMIN_CUSTOMERS: "adminCustomers",
    RECENT: "recent",
} as const;

/** Where readers write about their data; the same address Google shows on its sign-in consent screen. */
export const CONTACT_EMAIL = "isamammadlee@gmail.com";

/** When the privacy policy last changed (ISO date). */
export const PRIVACY_UPDATED = "2026-10-30T12:00:00";

/** When the terms of use last changed (ISO date). */
export const TERMS_UPDATED = "2026-10-30T12:00:00";
