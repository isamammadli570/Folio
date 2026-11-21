import {useCallback, useSyncExternalStore} from "react";
import {MOBILE_BREAKPOINT} from "@/constants/other";

export const useMediaQuery = (query: string): boolean => {
    const subscribe = useCallback((onChange: () => void) => {
        const list = window.matchMedia(query);
        list.addEventListener("change", onChange);
        return () => list.removeEventListener("change", onChange);
    }, [query]);
    return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
};

export const useIsMobile = (): boolean => useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
