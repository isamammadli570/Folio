import type {CartLine} from "@/helpers/cart";

/**
 * Joins the cart on this device with the one saved on the account when a reader signs in. Lines on this device keep
 * their order; for a book in both, the larger quantity wins (nobody loses the copies they added); saved-only lines follow.
 */
export const mergeCartLines = (local: CartLine[], saved: CartLine[]): CartLine[] => [
    ...local.map((line) => {
        const other = saved.find((item) => item.bookId === line.bookId);
        return other && other.quantity > line.quantity ? {...line, quantity: other.quantity} : line;
    }),
    ...saved.filter((line) => !local.some((item) => item.bookId === line.bookId)),
];

/** Favourites from this device first, then the saved ones it did not have. */
export const mergeIds = (local: string[], saved: string[]): string[] => [...local, ...saved.filter((id) => !local.includes(id))];

export const sameCart = (a: CartLine[], b: CartLine[]): boolean =>
    a.length === b.length && a.every((line, index) => line.bookId === b[index]?.bookId && line.quantity === b[index]?.quantity);

export const sameIds = (a: string[], b: string[]): boolean => a.length === b.length && a.every((id, index) => id === b[index]);
