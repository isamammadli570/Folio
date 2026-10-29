import {localRequest, notFound} from "@/api/client";
import type {Book, BookWithAuthor} from "@/api/types";
import {AUTHORS} from "@/data/authors";
import {BOOKS} from "@/data/books";
import {filterBooks, sortBooks, type BookFilters} from "@/helpers/catalog";
import {CATEGORY_IDS, type CategoryId, type SortId} from "@/constants/catalog";
import type {Language} from "@/i18n/resources";

export type BookListParams = BookFilters & {
    sort?: SortId;
    language: Language;
    /** Only these books, in this order (favorites, the cart). */
    ids?: string[];
    limit?: number;
};

const withAuthor = (book: Book): BookWithAuthor => {
    const author = AUTHORS.find((item) => item.id === book.authorId);
    if (!author) throw new Error(`Book ${book.id} points at unknown author ${book.authorId}`);
    return {...book, author};
};

export const getBooks = ({sort = "featured", language, ids, limit, ...filters}: BookListParams) =>
    localRequest<BookWithAuthor[]>(() => {
        const source = ids ? ids.flatMap((id) => BOOKS.filter((book) => book.id === id)) : BOOKS;
        const filtered = filterBooks(source.map(withAuthor), filters);
        const sorted = ids ? filtered : sortBooks(filtered, sort, language);
        return limit ? sorted.slice(0, limit) : sorted;
    });

export const getBook = (bookId: string) =>
    localRequest<BookWithAuthor>(() => withAuthor(BOOKS.find((book) => book.id === bookId) ?? notFound("Book")));

export const getCategoryCounts = () =>
    localRequest<Record<CategoryId, number>>(() =>
        Object.fromEntries(CATEGORY_IDS.map((id) => [id, BOOKS.filter((book) => book.category === id).length])) as Record<CategoryId, number>,
    );

/** Highest and lowest price in the catalogue, for the price filter's bounds. */
export const getPriceRange = () =>
    localRequest<[number, number]>(() => {
        const prices = BOOKS.map((book) => book.price);
        return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
    });
