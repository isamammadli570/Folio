import type {AddressRow, AuthorRow, BookRow, OrderRow, ProfileRow} from "@/api/rows";
import type {Address, Author, Book, BookTag, Order, Profile} from "@/api/types";
import {CATEGORY_IDS, ORNAMENTS, type CategoryId, type Ornament} from "@/constants/catalog";

const includes = <T extends string>(list: readonly T[], value: string): value is T => (list as readonly string[]).includes(value);

/** `null` columns become missing fields, the way the local data was written. */
export const mapAuthorRow = (row: AuthorRow): Author => ({
    id: row.id,
    name: row.name,
    born: row.born,
    died: row.died,
    ...(row.approx && {approx: true}),
    movement: row.movement,
    bio: row.bio,
    ...(row.quote && {quote: row.quote}),
    ...(row.featured !== null && {featured: row.featured}),
    ...(row.portrait && {portrait: row.portrait}),
    ...(row.scene && {scene: row.scene}),
});

/** Postgres `numeric` may arrive as a string; unknown categories and ornaments fall back so one bad row cannot break a page. */
export const mapBookRow = (row: BookRow): Book => {
    const category: CategoryId = includes(CATEGORY_IDS, row.category) ? row.category : "philosophy";
    const ornament: Ornament = includes(ORNAMENTS, row.ornament) ? row.ornament : "column";
    const tag: BookTag | null = row.tag === "bestseller" || row.tag === "new" ? row.tag : null;
    return {
        id: row.id,
        authorId: row.author_id,
        category,
        title: row.title,
        description: row.description,
        price: Number(row.price),
        ...(row.old_price !== null && {oldPrice: Number(row.old_price)}),
        stock: row.stock,
        pages: row.pages,
        year: row.year,
        ...(row.approx_year && {approxYear: true}),
        ornament,
        ...(tag && {tag}),
        ...(row.cover_image && {coverImage: row.cover_image}),
    };
};

export const mapOrderRow = (row: OrderRow): Order => ({
    id: row.id,
    number: row.number,
    status: row.status,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    deliveryMethod: row.delivery_method,
    city: row.city ?? "",
    address: row.address ?? "",
    note: row.note,
    paymentMethod: row.payment_method,
    subtotal: Number(row.subtotal),
    shipping: Number(row.shipping),
    total: Number(row.total),
    discount: Number(row.discount ?? 0),
    promoCode: row.promo_code ?? "",
    createdAt: row.created_at,
    items: row.order_items.map((item) => ({bookId: item.book_id, title: item.title, unitPrice: Number(item.unit_price), quantity: item.quantity})),
});

export const mapProfileRow = (row: ProfileRow): Profile => ({id: row.id, fullName: row.full_name ?? "", phone: row.phone ?? ""});

export const mapAddressRow = (row: AddressRow): Address => ({
    id: row.id,
    label: row.label,
    city: row.city,
    line: row.line,
    note: row.note,
    isDefault: row.is_default,
});
