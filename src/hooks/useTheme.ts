import {useSyncExternalStore} from "react";
import {storageGet, storageSet} from "@/lib/localStorage";
import {STORAGE_KEYS} from "@/constants/other";

export type Theme = "dark" | "light";

/** Browser-bar colour per theme; the same values as --background. */
const THEME_COLOR: Record<Theme, string> = {dark: "#0d0c0a", light: "#f3eee3"};

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

/** Switches the theme; the colours cross-fade for a moment unless the reader prefers less motion. */
export const setTheme = (next: Theme) => {
    if (next === theme) return;
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) {
        root.classList.add("theme-switching");
        window.setTimeout(() => root.classList.remove("theme-switching"), 450);
    }
    theme = next;
    apply(next);
    storageSet(STORAGE_KEYS.THEME, next);
    listeners.forEach((listener) => listener());
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

/** The site theme: dark unless the reader chose light. */
export const useTheme = () => {
    const current = useSyncExternalStore(subscribe, () => theme, () => "dark" as Theme);
    return {theme: current, toggle: () => setTheme(current === "dark" ? "light" : "dark")};
};
