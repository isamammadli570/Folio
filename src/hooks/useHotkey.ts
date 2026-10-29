import {useEffect, useRef} from "react";

/** Runs `handler` on Ctrl/⌘ + `key`, anywhere on the page. */
export const useHotkey = (key: string, handler: () => void): void => {
    const handlerRef = useRef(handler);

    useEffect(() => {
        handlerRef.current = handler;
    });

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== key) return;
            event.preventDefault();
            handlerRef.current();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [key]);
};
