import {useMemo, useState, type CSSProperties} from "react";
import {Link} from "react-router";
import {useTranslation} from "react-i18next";
import {Skeleton} from "@/components/ui/skeleton";
import {CATEGORY_IDS, type CategoryId} from "@/constants/catalog";
import {buildRoute} from "@/constants/routes";
import {useGetAuthors} from "@/hooks/authors";
import {useLanguage} from "@/hooks/useLanguage";
import {formatLifespan, surname} from "@/helpers/format";
import {preloadRoute} from "@/router/preload";
import {Medallion} from "@/widgets/Medallion";
import {Page} from "@/widgets/Page";
import {PageTitle} from "@/widgets/PageTitle";
import {QueryErrorState} from "@/widgets/QueryErrorState";
import {cn} from "@/lib/utils";

type Filter = CategoryId | "all";

/** Every author as a medallion with dates and school, grouped by the section most of their books are in. */
export const AuthorsPage = () => {
    const {t} = useTranslation(["authors", "common"]);
    const {pick} = useLanguage();
    const {items, isLoading, isError, refetch} = useGetAuthors();
    const [filter, setFilter] = useState<Filter>("all");

    const shown = useMemo(() => (filter === "all" ? items : items.filter((author) => author.category === filter)), [filter, items]);

    return (
        <Page>
            <PageTitle eyebrow={t("eyebrow")} title={t("title")} description={t("description")}/>

            <div role="group" aria-label={t("common:nav.categories")} className="mt-10 flex flex-wrap gap-2">
                {(["all", ...CATEGORY_IDS] as Filter[]).map((id) => (
                    <button
                        key={id}
                        type="button"
                        aria-pressed={filter === id}
                        onClick={() => setFilter(id)}
                        className={cn(
                            "cursor-pointer rounded-full border px-4 py-2 text-[13px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50",
                            filter === id ? "border-accent bg-accent text-accent-ink" : "border-border-strong text-muted-foreground hover:border-accent hover:text-foreground",
                        )}
                    >
                        {id === "all" ? t("all") : t(`common:categories.${id}`)}
                    </button>
                ))}
            </div>

            {isError ? <div className="mt-12"><QueryErrorState onRetry={() => void refetch()}/></div> : (
                <ul key={filter} className="stagger mt-12 grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {isLoading
                        ? Array.from({length: 10}, (_, index) => <li key={index} className="flex flex-col items-center gap-3"><Skeleton className="aspect-square w-3/4 rounded-full"/><Skeleton className="h-5 w-2/3"/></li>)
                        : shown.map((author, index) => {
                            const name = pick(author.name);
                            const href = buildRoute.author(author.id);
                            return (
                                <li key={author.id} style={{"--i": index} as CSSProperties}>
                                    <Link to={href} onPointerEnter={() => preloadRoute(href)} className="group flex flex-col items-center text-center outline-none">
                                        <span className="w-[72%] transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-1.5 group-hover:rotate-[-4deg] group-focus-visible:-translate-y-1.5">
                                            <Medallion letter={surname(name)[0]} portrait={author.portrait} alt={name} className="w-full"/>
                                        </span>
                                        <span className="mt-6 font-serif text-xl leading-tight transition-colors group-hover:text-accent-bright group-focus-visible:text-accent-bright">{name}</span>
                                        <span className="tabular mt-1 text-xs text-muted-foreground">{formatLifespan(author.born, author.died, t, author.approx)}</span>
                                        <span className="mt-2 text-[10.5px] uppercase tracking-[0.16em] text-faint-foreground">{pick(author.movement)} · {t("common:bookCount", {count: author.bookCount})}</span>
                                    </Link>
                                </li>
                            );
                        })}
                </ul>
            )}
        </Page>
    );
};
