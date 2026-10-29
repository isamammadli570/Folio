import type {CSSProperties, ReactNode} from "react";
import {Check} from "lucide-react";
import {useTranslation} from "react-i18next";
import {CATEGORY_COLOR, CATEGORY_IDS, PERIOD_IDS} from "@/constants/catalog";
import {useGetCategoryCounts, useGetPriceRange} from "@/hooks/books";
import {useLanguage} from "@/hooks/useLanguage";
import {formatPrice} from "@/helpers/format";
import type {CatalogParams} from "@/pages/CatalogPage/useCatalogParams";
import {cn} from "@/lib/utils";

type CatalogFiltersProps = {
    params: CatalogParams;
    onChange: (patch: Partial<CatalogParams>) => void;
};

const Group = ({title, children}: {title: string; children: ReactNode}) => (
    <fieldset className="border-t border-border pt-5 first:border-t-0 first:pt-0">
        <legend className="mb-3 text-[10.5px] font-medium uppercase tracking-[0.22em] text-accent">{title}</legend>
        {children}
    </fieldset>
);

const optionClass = (isActive: boolean) =>
    cn(
        "flex w-full cursor-pointer items-center gap-3 rounded-md px-2.5 py-2 text-left font-serif text-[17px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50",
        isActive ? "bg-accent-soft text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
    );

/** Section, period, price ceiling and stock; every change applies at once and is written to the URL. */
export const CatalogFilters = ({params, onChange}: CatalogFiltersProps) => {
    const {t} = useTranslation(["catalog", "common"]);
    const {language} = useLanguage();
    const {data: counts} = useGetCategoryCounts();
    const {data: range} = useGetPriceRange();
    const [min, max] = range ?? [0, 40];
    const ceiling = params.maxPrice ?? max;

    return (
        <div className="flex flex-col gap-6">
            <Group title={t("filters.category")}>
                <div className="flex flex-col gap-0.5">
                    <button type="button" aria-pressed={!params.category} onClick={() => onChange({category: undefined})} className={optionClass(!params.category)}>
                        <span className="size-2.5 rotate-45 border border-accent/70"/>
                        <span className="flex-1">{t("filters.all")}</span>
                    </button>
                    {CATEGORY_IDS.map((id) => (
                        <button key={id} type="button" aria-pressed={params.category === id} onClick={() => onChange({category: id})} className={optionClass(params.category === id)}>
                            <span className="size-2.5 rounded-[1px] brightness-[1.8]" style={{background: CATEGORY_COLOR[id]} as CSSProperties}/>
                            <span className="flex-1">{t(`common:categories.${id}`)}</span>
                            {counts && <span className="tabular font-sans text-xs text-faint-foreground">{counts[id]}</span>}
                        </button>
                    ))}
                </div>
            </Group>

            <Group title={t("filters.period")}>
                <div className="flex flex-wrap gap-2">
                    {PERIOD_IDS.map((id) => {
                        const isActive = params.period === id;
                        return (
                            <button
                                key={id}
                                type="button"
                                aria-pressed={isActive}
                                onClick={() => onChange({period: isActive ? undefined : id})}
                                className={cn(
                                    "cursor-pointer rounded-full border px-3.5 py-1.5 text-[13px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50",
                                    isActive ? "border-accent bg-accent text-accent-ink" : "border-border-strong text-muted-foreground hover:border-accent hover:text-foreground",
                                )}
                            >
                                {t(`filters.periods.${id}`)}
                            </button>
                        );
                    })}
                </div>
            </Group>

            <Group title={t("filters.price")}>
                <label htmlFor="catalog-max-price" className="tabular mb-3 block font-serif text-lg">{t("filters.upTo", {price: formatPrice(ceiling, language)})}</label>
                <input
                    id="catalog-max-price"
                    type="range"
                    min={min}
                    max={max}
                    step={1}
                    value={ceiling}
                    onChange={(event) => {
                        const value = Number(event.target.value);
                        onChange({maxPrice: value >= max ? undefined : value});
                    }}
                    className="w-full cursor-pointer accent-[var(--accent)]"
                />
                <div className="tabular mt-1 flex justify-between text-[11px] text-faint-foreground"><span>{formatPrice(min, language)}</span><span>{formatPrice(max, language)}</span></div>
            </Group>

            <Group title={t("common:stock.in")}>
                <button type="button" role="switch" aria-checked={params.inStockOnly} onClick={() => onChange({inStockOnly: !params.inStockOnly})} className="flex w-full cursor-pointer items-center gap-3 text-left text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:text-foreground">
                    <span className={cn("flex size-5 shrink-0 items-center justify-center rounded-sm border transition-colors", params.inStockOnly ? "border-accent bg-accent text-accent-ink" : "border-border-strong")}>
                        {params.inStockOnly && <Check className="animate-icon-pop size-3.5 stroke-[2.5]"/>}
                    </span>
                    {t("filters.inStock")}
                </button>
            </Group>
        </div>
    );
};
