import {getCatalogue, notFound} from "@/api/client";
import type {Author, Book} from "@/api/types";
import type {CategoryId} from "@/constants/catalog";

export type AuthorSummary = Author & {
    bookCount: number;
    /** The category most of the author's books belong to; used to tint their medallion and group the list. */
    category: CategoryId;
    /** Ids of the author's books, in catalogue order. */
    bookIds: string[];
};

const summarize = (allBooks: Book[], author: Author): AuthorSummary => {
    const books = allBooks.filter((book) => book.authorId === author.id);
    const tally = new Map<CategoryId, number>();
    books.forEach((book) => tally.set(book.category, (tally.get(book.category) ?? 0) + 1));
    const category = [...tally.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "philosophy";
    return {...author, bookCount: books.length, category, bookIds: books.map((book) => book.id)};
};

export const getAuthors = async () => {
    const {authors, books} = await getCatalogue();
    return authors.map((author) => summarize(books, author));
};

/** Authors shown in the home spotlight, in their `featured` order. */
export const getFeaturedAuthors = async () => {
    const {authors, books} = await getCatalogue();
    return authors
        .filter((author) => author.featured !== undefined)
        .sort((a, b) => (a.featured ?? 0) - (b.featured ?? 0))
        .map((author) => summarize(books, author));
};

export const getAuthor = async (authorId: string) => {
    const {authors, books} = await getCatalogue();
    return summarize(books, authors.find((author) => author.id === authorId) ?? notFound("Author"));
};
