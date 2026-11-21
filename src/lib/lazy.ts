import {lazy, useEffect, useState, type ComponentType} from "react";

type Importer<TProps> = () => Promise<ComponentType<TProps>>;

/**
 * A code-split component that can also be fetched ahead of time with `.preload()`; the chunk is requested once.
 * Used for things that are not on screen at first (drawers, dialogs, menus), so the first page carries less code.
 */
export const lazyComponent = <TProps extends object>(importer: Importer<TProps>) => {
    let promise: Promise<ComponentType<TProps>> | null = null;
    const preload = () => (promise ??= importer());
    const Component = lazy(async () => ({default: await preload()}));
    return Object.assign(Component, {preload});
};

/** Runs `task` once the browser has nothing better to do after the page has loaded (a timer where idle callbacks are missing). */
export const whenIdle = (task: () => void, timeout = 2500): (() => void) => {
    if (typeof window === "undefined") return () => undefined;
    if (typeof window.requestIdleCallback === "function") {
        const id = window.requestIdleCallback(task, {timeout});
        return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(task, 1200);
    return () => clearTimeout(id);
};

/** True from the first time `open` is true: an overlay is created when first needed and then kept, so it can animate out. */
export const useOpenedOnce = (open: boolean): boolean => {
    const [opened, setOpened] = useState(open);
    if (open && !opened) setOpened(true);
    return opened;
};

/** Preloads the given lazy components when the page is idle. */
export const usePreloadWhenIdle = (...components: {preload: () => unknown}[]) => {
    useEffect(
        () => whenIdle(() => components.forEach((component) => void component.preload())),
        // The components are module constants; one run is enough.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );
};
