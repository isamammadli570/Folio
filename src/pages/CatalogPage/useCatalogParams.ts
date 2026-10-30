import {useCallback, useMemo} from "react";
import {useSearchParams} from "react-router";
import {CATEGORY_IDS, PERIOD_IDS, SORT_IDS, type CategoryId, type PeriodId, type SortId} from "@/constants/catalog";

export type CatalogParams = {
    /** Several sections at once; empty means all. */
    categories: CategoryId[];
    /** Several periods at once; empty means all. */
    periods: PeriodId[];
    sort: SortId;
    query: string;
    maxPrice?: number;
    inStockOnly: boolean;
};

const oneOf = <TValue extends string>(value: string | null, allowed: readonly TValue[]): TValue | undefined =>
    allowed.find((item) => item === value);

/** "ancient,medieval" → ["ancient", "medieval"], in the catalogue's own order, unknown values dropped. */
const listOf = <TValue extends string>(value: string | null, allowed: readonly TValue[]): TValue[] => {
    const picked = new Set((value ?? "").split(","));
    return allowed.filter((item) => picked.has(item));
};

/** Adds the value to the list, or takes it out when it is already there. */
export const toggleIn = <TValue>(list: TValue[], value: TValue): TValue[] => (list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);

/**
 * The catalogue's filters live in the URL (`?category=history,literature&period=ancient&sort=price-asc&q=…`), so a
 * filtered shelf can be bookmarked, shared and restored with the back button. Unknown values are ignored, and the old
 * single-value links (`?category=history`) still work.
 */
export const useCatalogParams = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const params = useMemo<CatalogParams>(() => {
        const max = Number(searchParams.get("max"));
        return {
            categories: listOf(searchParams.get("category"), CATEGORY_IDS),
            periods: listOf(searchParams.get("period"), PERIOD_IDS),
            sort: oneOf(searchParams.get("sort"), SORT_IDS) ?? "featured",
            query: searchParams.get("q") ?? "",
            maxPrice: Number.isFinite(max) && max > 0 ? max : undefined,
            inStockOnly: searchParams.get("stock") === "1",
        };
    }, [searchParams]);

    const update = useCallback((patch: Partial<CatalogParams>) => {
        setSearchParams((current) => {
            const next = new URLSearchParams(current);
            const write = (key: string, value: string | undefined) => (value ? next.set(key, value) : next.delete(key));
            if (patch.categories) write("category", patch.categories.join(",") || undefined);
            if (patch.periods) write("period", patch.periods.join(",") || undefined);
            if ("sort" in patch) write("sort", patch.sort === "featured" ? undefined : patch.sort);
            if ("query" in patch) write("q", patch.query?.trim() || undefined);
            if ("maxPrice" in patch) write("max", patch.maxPrice ? String(patch.maxPrice) : undefined);
            if ("inStockOnly" in patch) write("stock", patch.inStockOnly ? "1" : undefined);
            return next;
        }, {replace: true, preventScrollReset: true});
    }, [setSearchParams]);

    const reset = useCallback(() => setSearchParams(new URLSearchParams(), {replace: true, preventScrollReset: true}), [setSearchParams]);

    const activeFilterCount = params.categories.length + params.periods.length + (params.maxPrice ? 1 : 0) + (params.inStockOnly ? 1 : 0);

    return {params, update, reset, activeFilterCount};
};
