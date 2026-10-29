import {localRequest, notFound} from "@/api/client";
import type {Author} from "@/api/types";
import {AUTHORS} from "@/data/authors";
import {BOOKS} from "@/data/books";
import type {CategoryId} from "@/constants/catalog";

export type AuthorSummary = Author & {
    bookCount: number;
    /** The category most of the author's books belong to; used to tint their medallion and group the list. */
    category: CategoryId;
    /** Ids of the author's books, in catalogue order. */
    bookIds: string[];
};

const summarize = (author: Author): AuthorSummary => {
    const books = BOOKS.filter((book) => book.authorId === author.id);
    const tally = new Map<CategoryId, number>();
    books.forEach((book) => tally.set(book.category, (tally.get(book.category) ?? 0) + 1));
    const category = [...tally.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "philosophy";
    return {...author, bookCount: books.length, category, bookIds: books.map((book) => book.id)};
};

export const getAuthors = () => localRequest<AuthorSummary[]>(() => AUTHORS.map(summarize));

/** Authors shown in the home spotlight, in their `featured` order. */
export const getFeaturedAuthors = () =>
    localRequest<AuthorSummary[]>(() =>
        AUTHORS.filter((author) => author.featured !== undefined)
            .sort((a, b) => (a.featured ?? 0) - (b.featured ?? 0))
            .map(summarize),
    );

export const getAuthor = (authorId: string) =>
    localRequest<AuthorSummary>(() => summarize(AUTHORS.find((author) => author.id === authorId) ?? notFound("Author")));
