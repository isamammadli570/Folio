import type {AuthorQuote, Localized, OrderStatus} from "@/api/types";

/** Rows as PostgREST returns them (snake_case). `helpers/rows` turns them into the storefront's types. */
export type AuthorRow = {
    id: string;
    name: Localized;
    born: number;
    died: number;
    approx: boolean;
    movement: Localized;
    bio: Localized;
    quote: AuthorQuote | null;
    featured: number | null;
    portrait: string | null;
    scene: string | null;
    position: number;
};

export type BookRow = {
    id: string;
    author_id: string;
    category: string;
    title: Localized;
    description: Localized;
    price: number | string;
    old_price: number | string | null;
    stock: number;
    pages: number;
    year: number;
    approx_year: boolean;
    ornament: string;
    tag: string | null;
    cover_image: string | null;
    position: number;
};

export const AUTHOR_COLUMNS = "id, name, born, died, approx, movement, bio, quote, featured, portrait, scene, position";
export const BOOK_COLUMNS =
    "id, author_id, category, title, description, price, old_price, stock, pages, year, approx_year, ornament, tag, cover_image, position";


export type OrderItemRow = {book_id: string; title: Localized; unit_price: number | string; quantity: number};

export type OrderRow = {
    id: string;
    number: string;
    status: OrderStatus;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    delivery_method: "courier" | "pickup";
    city: string | null;
    address: string | null;
    note: string;
    payment_method: "cash" | "card";
    subtotal: number | string;
    shipping: number | string;
    total: number | string;
    discount: number | string;
    promo_code: string | null;
    created_at: string;
    order_items: OrderItemRow[];
};

export const ORDER_COLUMNS =
    "id, number, status, first_name, last_name, email, phone, delivery_method, city, address, note, payment_method, subtotal, shipping, total, discount, promo_code, created_at, order_items(book_id, title, unit_price, quantity)";

export type ProfileRow = {id: string; full_name: string | null; phone: string | null};

export type AddressRow = {id: string; label: string; city: string; line: string; note: string; is_default: boolean};

export const ADDRESS_COLUMNS = "id, label, city, line, note, is_default";
