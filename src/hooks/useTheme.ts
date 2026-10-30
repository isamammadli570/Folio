import {useSyncExternalStore} from "react";
import {storageGet, storageSet} from "@/lib/localStorage";
import {STORAGE_KEYS} from "@/constants/other";

export type Theme = "dark" | "light";

/** Where the switch was pressed, so the new theme can open out from it. */
export type ThemeOrigin = {x: number; y: number};

/** Browser-bar colour per theme; the same values as --background. */
const THEME_COLOR: Record<Theme, string> = {dark: "#0d0c0a", light: "#f3eee3"};

const REVEAL_MS = 650;

const listeners = new Set<() => void>();

// The inline script in index.html has already applied a saved light theme before the first paint.
const readTheme = (): Theme => (typeof document !== "undefined" && document.documentElement.dataset.theme === "light" ? "light" : "dark");

let theme: Theme = readTheme();

const apply = (next: Theme) => {
    const root = document.documentElement;
    if (next === "light") root.dataset.theme = "light";
    else delete root.dataset.theme;
    root.classList.toggle("dark", next === "dark");
    document.querySelector<HTMLMetaElement>("meta[name=theme-color]")?.setAttribute("content", THEME_COLOR[next]);
};

const commit = (next: Theme) => {
    theme = next;
    apply(next);
    storageSet(STORAGE_KEYS.THEME, next);
    listeners.forEach((listener) => listener());
};

/**
 * Switches the theme. Where the browser supports view transitions the page is snapshotted once and the new theme
 * opens out as a circle from the switch, composited on the GPU; no element animates its own colours, so even long
 * pages stay smooth. Without support, or for readers who prefer less motion, the switch is instant.
 */
export const setTheme = (next: Theme, origin?: ThemeOrigin) => {
    if (next === theme) return;
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof document.startViewTransition !== "function") {
        commit(next);
        return;
    }

    const x = origin?.x ?? window.innerWidth / 2;
    const y = origin?.y ?? 0;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    root.classList.add("theme-reveal");
    const transition = document.startViewTransition(() => commit(next));
    void transition.ready.then(() => {
        root.animate(
            {clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`]},
            {duration: REVEAL_MS, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)"},
        );
    });
    void transition.finished.finally(() => root.classList.remove("theme-reveal"));
};

// Another tab changed the theme.
if (typeof window !== "undefined") {
    window.addEventListener("storage", (event) => {
        if (event.key !== STORAGE_KEYS.THEME) return;
        theme = storageGet(STORAGE_KEYS.THEME) === "light" ? "light" : "dark";
        apply(theme);
        listeners.forEach((listener) => listener());
    });
}

const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

/** The centre of an element, as the origin of the theme reveal. */
export const originOf = (element: Element | null): ThemeOrigin | undefined => {
    if (!element) return undefined;
    const rect = element.getBoundingClientRect();
    return {x: rect.left + rect.width / 2, y: rect.top + rect.height / 2};
};

/** The site theme: dark unless the reader chose light. */
export const useTheme = () => {
    const current = useSyncExternalStore(subscribe, () => theme, () => "dark" as Theme);
    return {theme: current, toggle: (origin?: ThemeOrigin) => setTheme(current === "dark" ? "light" : "dark", origin)};
};
