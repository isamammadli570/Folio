import type {PostgrestError} from "@supabase/postgrest-js";
import {publicDb} from "@/api/supabase";
import {AUTHOR_COLUMNS, BOOK_COLUMNS, type AuthorRow, type BookRow} from "@/api/rows";
import type {Author, Book} from "@/api/types";
import {mapAuthorRow, mapBookRow} from "@/helpers/rows";
import {CATALOGUE_TTL_MS} from "@/constants/other";
import {isLocalStorageAvailable, storageGet, storageRemove, storageSet} from "@/lib/localStorage";

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

/** The last catalogue read, kept in the browser so a returning visitor's pages draw at once; see `getCatalogue`. */
const STORED_KEY = `folio.catalogue.${__BUILD_ID__}`;
const STORED_MAX_AGE_MS = 7 * 24 * 60 * 60_000;

const readStored = (): Catalogue | null => {
    try {
        const raw = storageGet(STORED_KEY);
        if (!raw) return null;
        const stored = JSON.parse(raw) as {savedAt: number; data: Catalogue};
        return Date.now() - stored.savedAt < STORED_MAX_AGE_MS ? stored.data : null;
    } catch {
        return null;
    }
};

/** Older builds' copies are dropped, so a change in the data's shape can never be read back by new code. */
const writeStored = (data: Catalogue) => {
    if (!isLocalStorageAvailable()) return;
    try {
        for (const key of Object.keys(window.localStorage)) {
            if (key.startsWith("folio.catalogue.") && key !== STORED_KEY) window.localStorage.removeItem(key);
        }
    } catch {
        /* ignore */
    }
    storageSet(STORED_KEY, JSON.stringify({savedAt: Date.now(), data}));
};

let catalogue: {promise: Promise<Catalogue>; loadedAt: number; isStored?: boolean} | null = null;
const refreshListeners = new Set<() => void>();

/** Runs after a stored catalogue was shown and the fresh one has arrived, so the screens can re-read it. */
export const onCatalogueRefresh = (listener: () => void) => {
    refreshListeners.add(listener);
    return () => void refreshListeners.delete(listener);
};

// Public data: read with the anon key, without waiting for the stored session to be restored or refreshed.
const loadCatalogue = async (): Promise<Catalogue> => {
    const [authors, books] = await Promise.all([
        publicDb.from("authors").select(AUTHOR_COLUMNS).order("position").returns<AuthorRow[]>(),
        publicDb.from("books").select(BOOK_COLUMNS).order("position").returns<BookRow[]>(),
    ]);
    const data = {authors: unwrap(authors).map(mapAuthorRow), books: unwrap(books).map(mapBookRow)};
    writeStored(data);
    return data;
};

/**
 * The whole catalogue (45 authors, 60 books) in two requests, shared by every catalogue read for a few minutes.
 * Filtering and sorting stay in the browser, so search across languages works the same as before.
 *
 * A returning visitor gets the copy saved on their last visit at once (stale-while-revalidate): the fresh catalogue is
 * read in the background and the screens update when it lands. `fresh` skips the saved copy (the admin panel).
 * Offline, the saved copy keeps the shop browsable.
 */
export const getCatalogue = ({fresh = false}: {fresh?: boolean} = {}): Promise<Catalogue> => {
    if (catalogue && Date.now() - catalogue.loadedAt < CATALOGUE_TTL_MS && !(fresh && catalogue.isStored)) return catalogue.promise;
    const stored = !fresh && !catalogue ? readStored() : null;
    const network = loadCatalogue();
    const entry = {promise: network, loadedAt: Date.now()};
    catalogue = stored ? {promise: Promise.resolve(stored), loadedAt: Date.now(), isStored: true} : entry;
    network.then(
        () => {
            if (catalogue?.isStored) catalogue = entry;
            if (stored) refreshListeners.forEach((listener) => listener());
        },
        () => {
            if (catalogue === entry) catalogue = null;
        },
    );
    return stored ? catalogue.promise : network;
};

/** Forgets the cached catalogue, e.g. after an order changed stock. */
export const invalidateCatalogue = () => {
    catalogue = null;
    storageRemove(STORED_KEY);
};
