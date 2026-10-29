export const ROUTES = {
    HOME: "/",
    CATALOG: "/books",
    BOOK: "/books/:bookId",
    AUTHORS: "/authors",
    AUTHOR: "/authors/:authorId",
    FAVORITES: "/favorites",
    CHECKOUT: "/checkout",
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
