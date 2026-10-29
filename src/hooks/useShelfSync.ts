import {useEffect} from "react";
import {getSavedShelf, replaceCart, replaceFavorites} from "@/api/sync.api";
import {useAuth} from "@/hooks/useAuth";
import {cartActions, cartSource} from "@/hooks/useCart";
import {favoriteActions, favoritesSource} from "@/hooks/useFavorites";
import {mergeCartLines, mergeIds, sameCart, sameIds} from "@/helpers/shelf";
import type {CartLine} from "@/helpers/cart";
import {SHELF_SYNC_DELAY_MS} from "@/constants/other";

/**
 * Keeps the cart and favourites of a signed-in reader on the server. The localStorage stores stay the one source the UI
 * reads; on sign-in they are merged with what the account saved, and every later change is written back shortly after.
 * Mounted once, in the store layout.
 */
export const useShelfSync = () => {
    const {user} = useAuth();
    const userId = user?.id;

    useEffect(() => {
        if (!userId) return;
        let cancelled = false;
        let saved: {cart: CartLine[]; favorites: string[]} | null = null;
        const timers: number[] = [];

        const pushCart = () => {
            const lines = cartSource.get();
            if (!saved || sameCart(lines, saved.cart)) return;
            saved = {...saved, cart: lines};
            replaceCart(userId, lines).catch(() => { if (saved) saved = {...saved, cart: []}; });
        };
        const pushFavorites = () => {
            const ids = favoritesSource.get();
            if (!saved || sameIds(ids, saved.favorites)) return;
            saved = {...saved, favorites: ids};
            replaceFavorites(userId, ids).catch(() => { if (saved) saved = {...saved, favorites: []}; });
        };
        const later = (push: () => void) => () => {
            timers.push(window.setTimeout(push, SHELF_SYNC_DELAY_MS));
        };

        getSavedShelf()
            .then((shelf) => {
                if (cancelled) return;
                saved = shelf;
                cartActions.replace(mergeCartLines(cartSource.get(), shelf.cart));
                favoriteActions.replace(mergeIds(favoritesSource.get(), shelf.favorites));
                pushCart();
                pushFavorites();
            })
            .catch(() => undefined);

        const stopCart = cartSource.subscribe(later(pushCart));
        const stopFavorites = favoritesSource.subscribe(later(pushFavorites));
        return () => {
            cancelled = true;
            timers.forEach((timer) => window.clearTimeout(timer));
            stopCart();
            stopFavorites();
        };
    }, [userId]);
};
