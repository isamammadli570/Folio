import {useEffect, useState} from "react";
import {ArrowUpDown, Search, SlidersHorizontal, X} from "lucide-react";
import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {SORT_IDS, type SortId} from "@/constants/catalog";
import {CATALOG_PAGE_SIZE} from "@/constants/other";
import {useGetBooks} from "@/hooks/books";
import {useDebouncedValue} from "@/hooks/useDebouncedValue";
import {CatalogFilters} from "@/pages/CatalogPage/widgets/CatalogFilters";
import {useCatalogParams} from "@/pages/CatalogPage/useCatalogParams";
import {BookGrid, BookGridSkeleton} from "@/widgets/BookGrid";
import {EmptyState} from "@/widgets/EmptyState";
import {Page} from "@/widgets/Page";
import {PageTitle} from "@/widgets/PageTitle";
import {QueryErrorState} from "@/widgets/QueryErrorState";
import {Sheet} from "@/widgets/Sheet";
import {cn} from "@/lib/utils";

const isSort = (value: string): value is SortId => (SORT_IDS as string[]).includes(value);

/** The whole collection with search, filters on the left (a drawer on phones), sorting and "show more". */
export const CatalogPage = () => {
    const {t} = useTranslation(["catalog", "common"]);
    const {params, update, reset, activeFilterCount} = useCatalogParams();
    const [search, setSearch] = useState(params.query);
    const debouncedSearch = useDebouncedValue(search, 300);
    const [paging, setPaging] = useState({key: "", count: CATALOG_PAGE_SIZE});
    const [syncedQuery, setSyncedQuery] = useState(params.query);
    const [filtersOpen, setFiltersOpen] = useState(false);

    const {items, isLoading, isError, refetch, isPlaceholderData} = useGetBooks({
        categories: params.categories,
        periods: params.periods,
        sort: params.sort,
        query: params.query,
        maxPrice: params.maxPrice,
        inStockOnly: params.inStockOnly,
    });

    // Typing writes the query to the URL once the visitor pauses; a new query from outside (header search) refills the box.
    useEffect(() => {
        if (debouncedSearch.trim() !== params.query) update({query: debouncedSearch});
        // Only the debounced text should trigger a write.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);
    if (params.query !== syncedQuery) {
        setSyncedQuery(params.query);
        if (search.trim() !== params.query) setSearch(params.query);
    }

    // Any change of filters starts again from the first page.
    const filterKey = JSON.stringify(params);
    const visible = paging.key === filterKey ? paging.count : CATALOG_PAGE_SIZE;

    const title = params.categories.length > 0 ? params.categories.map((id) => t(`common:categories.${id}`)).join(" · ") : t("title");
    const shown = items.slice(0, visible);
    const hasFilters = activeFilterCount > 0 || params.query.length > 0;

    return (
        <Page>
            <PageTitle
                eyebrow={t("eyebrow")}
                title={title}
                description={isLoading ? undefined : t("results", {count: items.length})}
            />

            <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[15.5rem_minmax(0,1fr)] lg:gap-14">
                <aside className="hidden lg:block">
                    <div className="sticky top-[calc(var(--header-h)+2rem)]">
                        <CatalogFilters params={params} onChange={update}/>
                        {hasFilters && (
                            <Button variant="ghost" size="sm" onClick={() => { reset(); setSearch(""); }} className="mt-6 px-0 text-accent hover:bg-transparent hover:text-accent-bright">
                                <X/>{t("filters.reset")}
                            </Button>
                        )}
                    </div>
                </aside>

                <div className="min-w-0">
                    <div className="mb-10 flex flex-wrap items-center gap-3">
                        <label className="relative flex h-11 min-w-0 flex-1 basis-64 items-center gap-2.5 border-b border-border-strong transition-colors focus-within:border-accent">
                            <Search className="size-4 shrink-0 stroke-[1.5] text-accent"/>
                            <span className="sr-only">{t("searchPlaceholder")}</span>
                            <input id="catalog-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t("searchPlaceholder")} className="h-full min-w-0 flex-1 bg-transparent font-serif text-lg outline-none placeholder:text-faint-foreground"/>
                            {search && (
                                <button type="button" onClick={() => setSearch("")} aria-label={t("clearSearch")} className="cursor-pointer rounded-full p-1 text-muted-foreground hover:text-foreground"><X className="size-4"/></button>
                            )}
                        </label>

                        <Button variant="outline" onClick={() => setFiltersOpen(true)} className="h-11 rounded-full px-5 lg:hidden">
                            <SlidersHorizontal/>
                            {t("filters.title")}
                            {activeFilterCount > 0 && <span className="tabular flex size-5 items-center justify-center rounded-full bg-accent text-[11px] text-accent-ink">{activeFilterCount}</span>}
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="h-11 rounded-full px-5">
                                    <ArrowUpDown/>
                                    <span className="max-sm:sr-only">{t(`sort.${params.sort}`)}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="min-w-56">
                                <DropdownMenuRadioGroup value={params.sort} onValueChange={(value) => isSort(value) && update({sort: value})}>
                                    {SORT_IDS.map((id) => <DropdownMenuRadioItem key={id} value={id}>{t(`sort.${id}`)}</DropdownMenuRadioItem>)}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {isError ? (
                        <QueryErrorState onRetry={() => void refetch()}/>
                    ) : isLoading ? (
                        <BookGridSkeleton count={9} className="xl:grid-cols-3"/>
                    ) : items.length === 0 ? (
                        <EmptyState
                            title={t("empty.title")}
                            description={t("empty.description")}
                            action={<Button variant="outline" onClick={() => { reset(); setSearch(""); }}>{t("filters.reset")}</Button>}
                        />
                    ) : (
                        <>
                            <BookGrid books={shown} className={cn("xl:grid-cols-3 transition-opacity duration-300", isPlaceholderData && "opacity-40")}/>
                            {items.length > visible && (
                                <div className="mt-16 flex flex-col items-center gap-3">
                                    <p className="tabular text-xs text-faint-foreground">{t("shown", {shown: shown.length, total: items.length})}</p>
                                    <div className="h-px w-48 bg-border"><div className="h-full bg-accent transition-[width] duration-500" style={{width: `${(shown.length / items.length) * 100}%`}}/></div>
                                    <Button variant="outline" size="lg" className="mt-3" onClick={() => setPaging({key: filterKey, count: visible + CATALOG_PAGE_SIZE})}>{t("loadMore")}</Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen} title={t("filters.title")} side="left">
                <div className="flex items-center justify-between border-b border-sidebar-border px-5 py-4">
                    <h2 className="font-display text-[28px] font-medium">{t("filters.title")}</h2>
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setFiltersOpen(false)} aria-label={t("cart:close")}><X/></Button>
                </div>
                <div className="scroll-thin flex-1 overflow-y-auto p-5">
                    <CatalogFilters params={params} onChange={update}/>
                </div>
                <div className="flex gap-3 border-t border-sidebar-border p-5">
                    {hasFilters && <Button variant="outline" size="lg" onClick={() => { reset(); setSearch(""); }}>{t("filters.reset")}</Button>}
                    <Button variant="accent" size="lg" className="flex-1" onClick={() => setFiltersOpen(false)}>{t("filters.show", {count: items.length})}</Button>
                </div>
            </Sheet>
        </Page>
    );
};
