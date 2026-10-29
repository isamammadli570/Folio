import {useCallback} from "react";
import {useTranslation} from "react-i18next";
import {toast} from "sonner";
import type {Book} from "@/api/types";
import {cartActions} from "@/hooks/useCart";
import {useLanguage} from "@/hooks/useLanguage";
import {flyToCart} from "@/lib/flyTo";

/**
 * Adds a book to the cart with the full ceremony: the cover flies to the cart button, the badge bumps and a toast
 * offers the way to the cart. Pass the cover element to fly; without it the book is added at once.
 */
export const useAddToCart = () => {
    const {t} = useTranslation();
    const {pick} = useLanguage();

    return useCallback(
        (book: Pick<Book, "id" | "title" | "stock">, cover?: HTMLElement | null, quantity = 1) => {
            const land = () => {
                cartActions.add(book.id, book.stock, quantity);
                toast(t("actions.added", {title: pick(book.title)}), {
                    action: {label: t("actions.openCart"), onClick: () => cartActions.setDrawerOpen(true)},
                });
            };
            if (cover) flyToCart(cover, land);
            else land();
        },
        [pick, t],
    );
};
