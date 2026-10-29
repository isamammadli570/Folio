import type {ComponentType} from "react";
import type {LazyRouteFunction, RouteObject} from "react-router";

type PageModule = Record<string, ComponentType>;

const preloaders = new Map<string, () => Promise<unknown>>();

/** Route paths are patterns ("/books/:bookId"); a link's path is matched against them segment by segment. */
const matches = (pattern: string, path: string): boolean => {
    const a = pattern.split("/");
    const b = path.split("?")[0].split("/");
    return a.length === b.length && a.every((segment, index) => segment.startsWith(":") || segment === b[index]);
};

/**
 * A route whose page is code-split. The same importer is remembered, so hovering a link can warm the chunk
 * before the click (see `preloadRoute`).
 */
export const pageRoute = <TModule extends PageModule>(
    path: string,
    importer: () => Promise<TModule>,
    exportName: keyof TModule & string,
    extra: Omit<RouteObject, "path" | "lazy" | "Component" | "children" | "index"> = {},
): RouteObject => {
    preloaders.set(path, importer);
    const lazy: LazyRouteFunction<RouteObject> = async () => ({Component: (await importer())[exportName]});
    return {path, lazy, ...extra} as RouteObject;
};

export const preloadRoute = (path: string): void => {
    for (const [pattern, importer] of preloaders) {
        if (matches(pattern, path)) {
            void importer();
            return;
        }
    }
};
