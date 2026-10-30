import {useSyncExternalStore} from "react";
import {createPersistentStore} from "@/lib/persistentStore";
import {STORAGE_KEYS} from "@/constants/other";

const LIMIT = 10;

const isIdList = (value: unknown): value is string[] => Array.isArray(value) && value.every((item) => typeof item === "string");

const recentStore = createPersistentStore<string[]>(STORAGE_KEYS.RECENT, [], isIdList);

/** Puts a book at the front of the reader's history; at most ten are kept, in this browser only. */
export const recordView = (bookId: string) =>
    recentStore.set((ids) => [bookId, ...ids.filter((id) => id !== bookId)].slice(0, LIMIT));

/** Books the reader opened lately, newest first. */
export const useRecentlyViewed = () => useSyncExternalStore(recentStore.subscribe, recentStore.get, recentStore.get);
