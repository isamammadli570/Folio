import type {Author, Book, Order, OrderStatus} from "@/api/types";

/** A URL-safe id from a title: "The Brothers Karamazov" → "the-brothers-karamazov". Azerbaijani letters fold to Latin. */
export const slugify = (value: string): string =>
    value
        .toLowerCase()
        .replace(/ə/g, "e")
        .replace(/ı/g, "i")
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60);

/** Missing optional fields become `null`, so an edit can clear a column. */
export const toBookRow = (book: Book, position: number) => ({
    id: book.id,
    author_id: book.authorId,
    category: book.category,
    title: book.title,
    description: book.description,
    price: book.price,
    old_price: book.oldPrice ?? null,
    stock: book.stock,
    pages: book.pages,
    year: book.year,
    approx_year: Boolean(book.approxYear),
    ornament: book.ornament,
    tag: book.tag ?? null,
    cover_image: book.coverImage ?? null,
    position,
});

export const toAuthorRow = (author: Author, position: number) => ({
    id: author.id,
    name: author.name,
    born: author.born,
    died: author.died,
    approx: Boolean(author.approx),
    movement: author.movement,
    bio: author.bio,
    quote: author.quote ?? null,
    featured: author.featured ?? null,
    portrait: author.portrait ?? null,
    scene: author.scene ?? null,
    position,
});

export type OrderStats = {revenue: number; orders: number; average: number; byStatus: Record<OrderStatus, number>};

/** Revenue and averages count every order except cancelled ones. */
export const orderStats = (orders: Order[]): OrderStats => {
    const byStatus: Record<OrderStatus, number> = {new: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0};
    orders.forEach((order) => { byStatus[order.status] += 1; });
    const live = orders.filter((order) => order.status !== "cancelled");
    const revenue = Math.round(live.reduce((sum, order) => sum + order.total, 0) * 100) / 100;
    return {revenue, orders: live.length, average: live.length ? Math.round((revenue / live.length) * 100) / 100 : 0, byStatus};
};

export type DaySales = {day: string; total: number; count: number};

/** Sales per calendar day for the last `days` days ending today (local time), oldest first; empty days are zero. */
export const salesByDay = (orders: Order[], days: number, today = new Date()): DaySales[] => {
    const key = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const buckets = Array.from({length: days}, (_, index) => {
        const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (days - 1 - index));
        return {day: key(date), total: 0, count: 0};
    });
    const byKey = new Map(buckets.map((bucket) => [bucket.day, bucket]));
    orders.forEach((order) => {
        if (order.status === "cancelled") return;
        const bucket = byKey.get(key(new Date(order.createdAt)));
        if (!bucket) return;
        bucket.total = Math.round((bucket.total + order.total) * 100) / 100;
        bucket.count += 1;
    });
    return buckets;
};
