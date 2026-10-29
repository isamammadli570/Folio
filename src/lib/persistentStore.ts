import {storageGet, storageSet} from "@/lib/localStorage";

export type PersistentStore<TState> = {
    get: () => TState;
    set: (update: (state: TState) => TState) => void;
    subscribe: (listener: () => void) => () => void;
};

/**
 * A tiny external store kept in localStorage, for `useSyncExternalStore`. Changes made in another tab arrive through
 * the `storage` event, so two open tabs show the same cart.
 */
export const createPersistentStore = <TState>(key: string, initial: TState, isValid: (value: unknown) => value is TState): PersistentStore<TState> => {
    const read = (): TState => {
        try {
            const parsed: unknown = JSON.parse(storageGet(key) ?? "null");
            return isValid(parsed) ? parsed : initial;
        } catch {
            return initial;
        }
    };

    let state = read();
    const listeners = new Set<() => void>();
    const emit = () => listeners.forEach((listener) => listener());

    if (typeof window !== "undefined") {
        window.addEventListener("storage", (event) => {
            if (event.key !== key) return;
            state = read();
            emit();
        });
    }

    return {
        get: () => state,
        set: (update) => {
            state = update(state);
            storageSet(key, JSON.stringify(state));
            emit();
        },
        subscribe: (listener) => {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
    };
};
