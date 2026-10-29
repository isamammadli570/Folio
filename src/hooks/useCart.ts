import {useSyncExternalStore} from "react";
import {createPersistentStore} from "@/lib/persistentStore";
import {addLine, countItems, isCartLines, setLineQuantity, type CartLine} from "@/helpers/cart";
import {STORAGE_KEYS} from "@/constants/other";

const cartStore = createPersistentStore<CartLine[]>(STORAGE_KEYS.CART, [], isCartLines);

type DrawerListener = (open: boolean) => void;
const drawerListeners = new Set<DrawerListener>();
let drawerOpen = false;

/** Actions on the cart; usable outside React (the fly-to-cart animation calls `add` when it lands). */
export const cartActions = {
    add: (bookId: string, stock: number, quantity = 1) => cartStore.set((lines) => addLine(lines, bookId, quantity, stock)),
    setQuantity: (bookId: string, quantity: number) => cartStore.set((lines) => setLineQuantity(lines, bookId, quantity)),
    remove: (bookId: string) => cartStore.set((lines) => setLineQuantity(lines, bookId, 0)),
    clear: () => cartStore.set(() => []),
    /** Swaps the whole cart, e.g. for the merged one after signing in. */
    replace: (lines: CartLine[]) => cartStore.set(() => lines),
    setDrawerOpen: (open: boolean) => {
        drawerOpen = open;
        drawerListeners.forEach((listener) => listener(open));
    },
};

/** The cart lines kept in localStorage, plus the total number of copies. */
export const useCart = () => {
    const lines = useSyncExternalStore(cartStore.subscribe, cartStore.get, cartStore.get);
    return {lines, count: countItems(lines)};
};

const subscribeDrawer = (listener: () => void) => {
    drawerListeners.add(listener);
    return () => drawerListeners.delete(listener);
};

/** Whether the cart drawer is open; any button can open it through `cartActions.setDrawerOpen`. */
export const useCartDrawer = () => useSyncExternalStore(subscribeDrawer, () => drawerOpen, () => false);

/** The raw store, for the account sync that mirrors the cart to the server. */
export const cartSource = {get: cartStore.get, subscribe: cartStore.subscribe};
