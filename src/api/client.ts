import type {PostgrestError} from "@supabase/supabase-js";
import {supabase} from "@/api/supabase";
import {AUTHOR_COLUMNS, BOOK_COLUMNS, type AuthorRow, type BookRow} from "@/api/rows";
import type {Author, Book} from "@/api/types";
import {mapAuthorRow, mapBookRow} from "@/helpers/rows";
import {CATALOGUE_TTL_MS} from "@/constants/other";

/** A failed request. `code` carries the database's short error code (OUT_OF_STOCK, EMPTY_CART…) when there is one. */
export class ApiError extends Error {
    readonly status: number;
    readonly code: string;

    constructor(message: string, status: number, code = "") {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.code = code;
    }
}

export const notFound = (what: string): never => {
    throw new ApiError(`${what} not found`, 404);
};

/** Unwraps a Supabase response, throwing an ApiError for its error. */
export const unwrap = <TData>({data, error}: {data: TData | null; error: PostgrestError | null}): TData => {
    if (error) throw new ApiError(error.message, Number(error.code) || 500, error.message.split(":")[0]?.trim());
    if (data === null) throw new ApiError("Empty response", 500);
    return data;
};

export type Catalogue = {authors: Author[]; books: Book[]};

let catalogue: {promise: Promise<Catalogue>; loadedAt: number} | null = null;

const loadCatalogue = async (): Promise<Catalogue> => {
    const [authors, books] = await Promise.all([
        supabase.from("authors").select(AUTHOR_COLUMNS).order("position").returns<AuthorRow[]>(),
        supabase.from("books").select(BOOK_COLUMNS).order("position").returns<BookRow[]>(),
    ]);
    return {authors: unwrap(authors).map(mapAuthorRow), books: unwrap(books).map(mapBookRow)};
};

/**
 * The whole catalogue (45 authors, 60 books) in two requests, shared by every catalogue read for a few minutes.
 * Filtering and sorting stay in the browser, so search across languages works the same as before.
 */
export const getCatalogue = (): Promise<Catalogue> => {
    if (catalogue && Date.now() - catalogue.loadedAt < CATALOGUE_TTL_MS) return catalogue.promise;
    const promise = loadCatalogue();
    catalogue = {promise, loadedAt: Date.now()};
    promise.catch(() => {
        if (catalogue?.promise === promise) catalogue = null;
    });
    return promise;
};

/** Forgets the cached catalogue, e.g. after an order changed stock. */
export const invalidateCatalogue = () => {
    catalogue = null;
};
