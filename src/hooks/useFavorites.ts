import {useSyncExternalStore} from "react";
import {createPersistentStore} from "@/lib/persistentStore";
import {STORAGE_KEYS} from "@/constants/other";

const isIdList = (value: unknown): value is string[] => Array.isArray(value) && value.every((item) => typeof item === "string");

const favoritesStore = createPersistentStore<string[]>(STORAGE_KEYS.FAVORITES, [], isIdList);

export const favoriteActions = {
    toggle: (bookId: string) =>
        favoritesStore.set((ids) => (ids.includes(bookId) ? ids.filter((id) => id !== bookId) : [bookId, ...ids])),
};

/** Book ids the visitor has saved, newest first. */
export const useFavorites = () => {
    const ids = useSyncExternalStore(favoritesStore.subscribe, favoritesStore.get, favoritesStore.get);
    return {ids, isFavorite: (bookId: string) => ids.includes(bookId)};
};
