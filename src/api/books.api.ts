import {getCatalogue, notFound, type Catalogue} from "@/api/client";
import type {Book, BookWithAuthor} from "@/api/types";
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

const withAuthor = ({authors}: Catalogue, book: Book): BookWithAuthor => {
    const author = authors.find((item) => item.id === book.authorId);
    if (!author) throw new Error(`Book ${book.id} points at unknown author ${book.authorId}`);
    return {...book, author};
};

export const getBooks = async ({sort = "featured", language, ids, limit, ...filters}: BookListParams) => {
    const catalogue = await getCatalogue();
    const {books} = catalogue;
    const source = ids ? ids.flatMap((id) => books.filter((book) => book.id === id)) : books;
    const filtered = filterBooks(source.map((book) => withAuthor(catalogue, book)), filters);
    const sorted = ids ? filtered : sortBooks(filtered, sort, language);
    return limit ? sorted.slice(0, limit) : sorted;
};

export const getBook = async (bookId: string): Promise<BookWithAuthor> => {
    const catalogue = await getCatalogue();
    return withAuthor(catalogue, catalogue.books.find((book) => book.id === bookId) ?? notFound("Book"));
};

export const getCategoryCounts = async () => {
    const {books} = await getCatalogue();
    return Object.fromEntries(CATEGORY_IDS.map((id) => [id, books.filter((book) => book.category === id).length])) as Record<CategoryId, number>;
};

/** Highest and lowest price in the catalogue, for the price filter's bounds. */
export const getPriceRange = async (): Promise<[number, number]> => {
    const prices = (await getCatalogue()).books.map((book) => book.price);
    return prices.length ? [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))] : [0, 0];
};
