import {useCallback, useMemo} from "react";
import {useSearchParams} from "react-router";
import {CATEGORY_IDS, PERIOD_IDS, SORT_IDS, type CategoryId, type PeriodId, type SortId} from "@/constants/catalog";

export type CatalogParams = {
    category?: CategoryId;
    period?: PeriodId;
    sort: SortId;
    query: string;
    maxPrice?: number;
    inStockOnly: boolean;
};

const oneOf = <TValue extends string>(value: string | null, allowed: readonly TValue[]): TValue | undefined =>
    allowed.find((item) => item === value);

/**
 * The catalogue's filters live in the URL (`?category=history&sort=price-asc&q=…`), so a filtered shelf can be
 * bookmarked, shared and restored with the back button. Unknown values are ignored.
 */
export const useCatalogParams = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const params = useMemo<CatalogParams>(() => {
        const max = Number(searchParams.get("max"));
        return {
            category: oneOf(searchParams.get("category"), CATEGORY_IDS),
            period: oneOf(searchParams.get("period"), PERIOD_IDS),
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
            if ("category" in patch) write("category", patch.category);
            if ("period" in patch) write("period", patch.period);
            if ("sort" in patch) write("sort", patch.sort === "featured" ? undefined : patch.sort);
            if ("query" in patch) write("q", patch.query?.trim() || undefined);
            if ("maxPrice" in patch) write("max", patch.maxPrice ? String(patch.maxPrice) : undefined);
            if ("inStockOnly" in patch) write("stock", patch.inStockOnly ? "1" : undefined);
            return next;
        }, {replace: true, preventScrollReset: true});
    }, [setSearchParams]);

    const reset = useCallback(() => setSearchParams(new URLSearchParams(), {replace: true, preventScrollReset: true}), [setSearchParams]);

    const activeFilterCount = [params.category, params.period, params.maxPrice, params.inStockOnly || undefined].filter(Boolean).length;

    return {params, update, reset, activeFilterCount};
};
