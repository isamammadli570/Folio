import {unwrap} from "@/api/client";
import {supabase} from "@/api/supabase";

export type Review = {id: string; bookId: string; userId: string; authorName: string; rating: number; body: string; createdAt: string};

export type Rating = {average: number; count: number};

type ReviewRow = {id: string; book_id: string; user_id: string; author_name: string; rating: number; body: string; created_at: string};

const REVIEW_COLUMNS = "id, book_id, user_id, author_name, rating, body, created_at";

const mapReview = (row: ReviewRow): Review => ({
    id: row.id,
    bookId: row.book_id,
    userId: row.user_id,
    authorName: row.author_name,
    rating: row.rating,
    body: row.body,
    createdAt: row.created_at,
});

export const getReviews = async (bookId: string): Promise<Review[]> => {
    const response = await supabase.from("reviews").select(REVIEW_COLUMNS).eq("book_id", bookId).order("created_at", {ascending: false}).returns<ReviewRow[]>();
    return unwrap(response).map(mapReview);
};

/** Average and count per book, for the stars on cards; one small query for the whole catalogue. */
export const getRatings = async (): Promise<Record<string, Rating>> => {
    const response = await supabase.from("reviews").select("book_id, rating").returns<{book_id: string; rating: number}[]>();
    const sums = new Map<string, {total: number; count: number}>();
    unwrap(response).forEach(({book_id: bookId, rating}) => {
        const entry = sums.get(bookId) ?? {total: 0, count: 0};
        sums.set(bookId, {total: entry.total + rating, count: entry.count + 1});
    });
    return Object.fromEntries([...sums].map(([bookId, {total, count}]) => [bookId, {average: Math.round((total / count) * 10) / 10, count}]));
};

/** Whether the signed-in reader ordered this book (and so may review it). */
export const canReview = async (bookId: string): Promise<boolean> => {
    const {data, error} = await supabase.rpc("has_bought", {p_book_id: bookId});
    if (error) return false;
    return data === true;
};

/** Writes the reader's review, or replaces it: one review per reader per book. Name and owner are set by the database. */
export const saveReview = async ({bookId, rating, body, reviewId}: {bookId: string; rating: number; body: string; reviewId?: string}) => {
    const row = {book_id: bookId, rating, body: body.trim()};
    const {error} = reviewId
        ? await supabase.from("reviews").update(row).eq("id", reviewId)
        : await supabase.from("reviews").insert(row);
    if (error) unwrap({data: null, error});
};

export const deleteReview = async (reviewId: string) => {
    const {error} = await supabase.from("reviews").delete().eq("id", reviewId);
    if (error) unwrap({data: null, error});
};
