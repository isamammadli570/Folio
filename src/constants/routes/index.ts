/** The id an admin form uses for a record that does not exist yet. */
export const NEW_ID = "new";

export const ROUTES = {
    HOME: "/",
    CATALOG: "/books",
    BOOK: "/books/:bookId",
    AUTHORS: "/authors",
    AUTHOR: "/authors/:authorId",
    FAVORITES: "/favorites",
    CHECKOUT: "/checkout",
    PRIVACY: "/privacy",
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    ACCOUNT: "/account",
    ACCOUNT_ADDRESSES: "/account/addresses",
    ACCOUNT_PROFILE: "/account/profile",
    ADMIN: "/admin",
    ADMIN_BOOKS: "/admin/books",
    ADMIN_BOOK: "/admin/books/:bookId",
    ADMIN_AUTHORS: "/admin/authors",
    ADMIN_AUTHOR: "/admin/authors/:authorId",
    ADMIN_ORDERS: "/admin/orders",
} as const;

/** Builders for the routes that carry a parameter. */
export const buildRoute = {
    book: (bookId: string) => `${ROUTES.CATALOG}/${encodeURIComponent(bookId)}`,
    author: (authorId: string) => `${ROUTES.AUTHORS}/${encodeURIComponent(authorId)}`,
    /** "new" opens an empty form. */
    adminBook: (bookId: string) => `${ROUTES.ADMIN_BOOKS}/${encodeURIComponent(bookId)}`,
    adminAuthor: (authorId: string) => `${ROUTES.ADMIN_AUTHORS}/${encodeURIComponent(authorId)}`,
    catalog: (params: Record<string, string | undefined> = {}) => {
        const search = new URLSearchParams(Object.entries(params).filter((entry): entry is [string, string] => Boolean(entry[1])));
        const query = search.toString();
        return query ? `${ROUTES.CATALOG}?${query}` : ROUTES.CATALOG;
    },
};

/** Where a sign-in page sends the reader afterwards: the `next` it was given, if it is a path on this site. */
export const safeNext = (next: string | null): string => (next && next.startsWith("/") && !next.startsWith("//") ? next : ROUTES.ACCOUNT);
