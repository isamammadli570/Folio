import {useMemo} from "react";
import {useCart} from "@/hooks/useCart";
import {useGetBooks} from "@/hooks/books";
import {cartTotals} from "@/helpers/cart";

/** The cart joined with its books: lines in cart order with the book attached, and the money totals. */
export const useCartSummary = () => {
    const {lines, count} = useCart();
    const ids = useMemo(() => lines.map((line) => line.bookId), [lines]);
    const {items: books, isLoading} = useGetBooks({ids}, ids.length > 0);

    return useMemo(() => {
        const rows = lines.flatMap((line) => {
            const book = books.find((item) => item.id === line.bookId);
            return book ? [{...line, book}] : [];
        });
        return {lines, rows, count, totals: cartTotals(lines, books), isLoading: isLoading && ids.length > 0};
    }, [books, count, ids.length, isLoading, lines]);
};
