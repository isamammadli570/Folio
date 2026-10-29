import {useSyncExternalStore} from "react";
import type {Session, User} from "@supabase/supabase-js";
import {supabase} from "@/api/supabase";

type AuthState = {session: Session | null; user: User | null; isReady: boolean};

let state: AuthState = {session: null, user: null, isReady: false};
const listeners = new Set<() => void>();

// One listener for the whole app; it fires INITIAL_SESSION first, so `isReady` turns true once the stored session is read.
supabase.auth.onAuthStateChange((_event, session) => {
    state = {session, user: session?.user ?? null, isReady: true};
    listeners.forEach((listener) => listener());
});

const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

const getState = () => state;

/** The signed-in reader, if any. `isReady` is false until the stored session has been read. */
export const useAuth = () => useSyncExternalStore(subscribe, getState, getState);

/** The current user outside React (route loaders). Waits for the stored session to be read. */
export const getCurrentUser = async (): Promise<User | null> => {
    if (state.isReady) return state.user;
    const {data} = await supabase.auth.getSession();
    return data.session?.user ?? null;
};
