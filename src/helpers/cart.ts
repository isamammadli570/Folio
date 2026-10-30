import type {Book} from "@/api/types";
import {FREE_SHIPPING_FROM, SHIPPING_FEE} from "@/constants/other";

export type CartLine = {bookId: string; quantity: number};

export const isCartLines = (value: unknown): value is CartLine[] =>
    Array.isArray(value)
    && value.every((line) => typeof line === "object" && line !== null && typeof line.bookId === "string" && Number.isInteger(line.quantity) && line.quantity > 0);

/** Adds `quantity` copies, never more than the stock allows; a new book goes to the top of the cart. */
export const addLine = (lines: CartLine[], bookId: string, quantity: number, stock: number): CartLine[] => {
    const existing = lines.find((line) => line.bookId === bookId);
    const next = Math.min(stock, (existing?.quantity ?? 0) + quantity);
    if (next <= 0) return lines;
    if (existing) return lines.map((line) => (line.bookId === bookId ? {...line, quantity: next} : line));
    return [{bookId, quantity: next}, ...lines];
};

/** Sets a line's quantity; zero or less removes it. */
export const setLineQuantity = (lines: CartLine[], bookId: string, quantity: number): CartLine[] =>
    quantity <= 0 ? lines.filter((line) => line.bookId !== bookId) : lines.map((line) => (line.bookId === bookId ? {...line, quantity} : line));

export const countItems = (lines: CartLine[]): number => lines.reduce((sum, line) => sum + line.quantity, 0);

export type CartTotals = {subtotal: number; shipping: number; total: number; toFreeShipping: number};

/** Money is summed in qəpik so 0.1 + 0.2 never leaks into a total. */
export const cartTotals = (lines: CartLine[], books: Pick<Book, "id" | "price">[]): CartTotals => {
    const subtotalQ = lines.reduce((sum, line) => {
        const book = books.find((item) => item.id === line.bookId);
        return book ? sum + Math.round(book.price * 100) * line.quantity : sum;
    }, 0);
    const subtotal = subtotalQ / 100;
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;
    return {subtotal, shipping, total: (subtotalQ + shipping * 100) / 100, toFreeShipping: Math.max(0, (FREE_SHIPPING_FROM * 100 - subtotalQ) / 100)};
};

export type DiscountedTotals = CartTotals & {discount: number; percent: number};

/**
 * Takes a promo percentage off the books (not the delivery), rounded to the qəpik, exactly as place_order() does on the
 * server. Free delivery still depends on the price before the discount.
 */
export const applyDiscount = (totals: CartTotals, percent: number): DiscountedTotals => {
    const discount = Math.round(totals.subtotal * percent) / 100;
    return {...totals, percent, discount, total: Math.round((totals.subtotal - discount + totals.shipping) * 100) / 100};
};
