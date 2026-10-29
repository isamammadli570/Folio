import type {Book, BookWithAuthor, Localized} from "@/api/types";
import {PERIOD_RANGE, type CategoryId, type PeriodId, type SortId} from "@/constants/catalog";
import type {Language} from "@/i18n/resources";

export type BookFilters = {
    category?: CategoryId;
    authorId?: string;
    period?: PeriodId;
    query?: string;
    minPrice?: number;
    maxPrice?: number;
    inStockOnly?: boolean;
};

/** Lower-cases and strips accents so "Nitsşe", "nitsse" and "NITSŞE" meet; "ə" folds to "e" and dotless "ı" to "i". */
export const normalizeSearch = (value: string): string =>
    value
        .toLocaleLowerCase("az")
        .replace(/ə/g, "e")
        .replace(/ı/g, "i")
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .trim();

const localizedValues = (value: Localized): string[] => Object.values(value);

/** A book matches when every word of the query appears in its title or author name, in any of the site languages. */
export const matchesQuery = (book: BookWithAuthor, query: string): boolean => {
    const words = normalizeSearch(query).split(/\s+/).filter(Boolean);
    if (words.length === 0) return true;
    const haystack = normalizeSearch([...localizedValues(book.title), ...localizedValues(book.author.name)].join(" "));
    return words.every((word) => haystack.includes(word));
};

export const isInPeriod = (year: number, period: PeriodId): boolean => {
    const [from, to] = PERIOD_RANGE[period];
    return year >= from && year <= to;
};

export const filterBooks = (books: BookWithAuthor[], filters: BookFilters): BookWithAuthor[] =>
    books.filter((book) =>
        (!filters.category || book.category === filters.category)
        && (!filters.authorId || book.authorId === filters.authorId)
        && (!filters.period || isInPeriod(book.year, filters.period))
        && (filters.minPrice === undefined || book.price >= filters.minPrice)
        && (filters.maxPrice === undefined || book.price <= filters.maxPrice)
        && (!filters.inStockOnly || book.stock > 0)
        && (!filters.query || matchesQuery(book, filters.query)),
    );

const tagWeight = (book: Book): number => (book.tag === "bestseller" ? 0 : book.tag === "new" ? 1 : 2);

/** Returns a new, sorted array. "featured" keeps bestsellers, then new titles, then catalogue order. */
export const sortBooks = <TBook extends Book>(books: TBook[], sort: SortId, language: Language): TBook[] => {
    const sorted = [...books];
    const collator = new Intl.Collator(language);
    switch (sort) {
        case "price-asc":
            return sorted.sort((a, b) => a.price - b.price);
        case "price-desc":
            return sorted.sort((a, b) => b.price - a.price);
        case "title":
            return sorted.sort((a, b) => collator.compare(a.title[language], b.title[language]));
        case "oldest":
            return sorted.sort((a, b) => a.year - b.year);
        case "newest":
            return sorted.sort((a, b) => b.year - a.year);
        default:
            return sorted.sort((a, b) => tagWeight(a) - tagWeight(b));
    }
};

export const discountPercent = (book: Pick<Book, "price" | "oldPrice">): number | null =>
    book.oldPrice && book.oldPrice > book.price ? Math.round((1 - book.price / book.oldPrice) * 100) : null;

/** Stock levels the shelf shows: none, a few left (5 or fewer), plenty. */
export const stockLevel = (stock: number): "out" | "low" | "in" => (stock <= 0 ? "out" : stock <= 5 ? "low" : "in");
