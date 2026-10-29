export const ROUTES = {
    HOME: "/",
    CATALOG: "/books",
    BOOK: "/books/:bookId",
    AUTHORS: "/authors",
    AUTHOR: "/authors/:authorId",
    FAVORITES: "/favorites",
    CHECKOUT: "/checkout",
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    ACCOUNT: "/account",
    ACCOUNT_ADDRESSES: "/account/addresses",
    ACCOUNT_PROFILE: "/account/profile",
} as const;

/** Builders for the routes that carry a parameter. */
export const buildRoute = {
    book: (bookId: string) => `${ROUTES.CATALOG}/${encodeURIComponent(bookId)}`,
    author: (authorId: string) => `${ROUTES.AUTHORS}/${encodeURIComponent(authorId)}`,
    catalog: (params: Record<string, string | undefined> = {}) => {
        const search = new URLSearchParams(Object.entries(params).filter((entry): entry is [string, string] => Boolean(entry[1])));
        const query = search.toString();
        return query ? `${ROUTES.CATALOG}?${query}` : ROUTES.CATALOG;
    },
};

/** Where a sign-in page sends the reader afterwards: the `next` it was given, if it is a path on this site. */
export const safeNext = (next: string | null): string => (next && next.startsWith("/") && !next.startsWith("//") ? next : ROUTES.ACCOUNT);
