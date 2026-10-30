import {useMemo, useState, type CSSProperties} from "react";
import {Link} from "react-router";
import {Plus, Search, Star} from "lucide-react";
import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Skeleton} from "@/components/ui/skeleton";
import {CATEGORY_COLOR} from "@/constants/catalog";
import {buildRoute, NEW_ID} from "@/constants/routes";
import {formatLifespan, surname} from "@/helpers/format";
import {normalizeSearch} from "@/helpers/catalog";
import {useGetAuthors} from "@/hooks/authors";
import {useLanguage} from "@/hooks/useLanguage";
import {EmptyState} from "@/widgets/EmptyState";
import {Medallion} from "@/widgets/Medallion";
import {PageTitle} from "@/widgets/PageTitle";
import {QueryErrorState} from "@/widgets/QueryErrorState";

/** The authors as cards with their medallion, years and book count; a card opens the author's form. */
export const AdminAuthorsPage = () => {
    const {t} = useTranslation(["admin", "common"]);
    const {pick} = useLanguage();
    const {items: authors, isLoading, isError, refetch} = useGetAuthors();
    const [query, setQuery] = useState("");

    const visible = useMemo(() => {
        const needle = normalizeSearch(query);
        return authors.filter((author) => !needle || normalizeSearch(Object.values(author.name).join(" ")).includes(needle));
    }, [authors, query]);

    return (
        <section>
            <PageTitle
                title={t("authors.title")}
                description={t("authors.subtitle", {count: authors.length})}
                actions={<Button asChild variant="accent" className="rounded-full"><Link to={buildRoute.adminAuthor(NEW_ID)}><Plus/>{t("authors.new")}</Link></Button>}
            />
            <div className="relative mt-8 w-full sm:w-80">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
                <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("authors.search")} className="pl-9" aria-label={t("authors.search")}/>
            </div>

            <div className="mt-4">
                {isLoading ? <div className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 xl:grid-cols-3">{[0, 1, 2, 3, 4, 5].map((key) => <Skeleton key={key} className="h-24 rounded-xl"/>)}</div>
                    : isError ? <QueryErrorState onRetry={() => void refetch()}/>
                    : visible.length === 0 ? <EmptyState title={t("authors.noMatch")}/>
                    : (
                        <ul className="stagger grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            {visible.map((author, index) => {
                                const name = pick(author.name);
                                return (
                                    <li key={author.id} style={{"--i": Math.min(index, 12)} as CSSProperties}>
                                        <Link to={buildRoute.adminAuthor(author.id)} className="flex items-center gap-4 rounded-xl border border-border bg-surface p-3.5 outline-none transition-colors hover:border-accent/60 focus-visible:ring-2 focus-visible:ring-ring/40">
                                            <span className="w-14 shrink-0"><Medallion letter={surname(name)[0] ?? "?"} portrait={author.portrait} alt="" className="w-full"/></span>
                                            <span className="min-w-0 flex-1">
                                                <span className="flex items-center gap-1.5 truncate font-serif text-[18px] leading-tight">
                                                    {name}
                                                    {author.featured !== undefined && <Star className="size-3.5 shrink-0 fill-accent text-accent" aria-label={t("authors.featured")}/>}
                                                </span>
                                                <span className="block truncate text-xs text-muted-foreground">{formatLifespan(author.born, author.died, t, author.approx)}</span>
                                                <span className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <span className="size-2 rounded-[2px]" style={{background: CATEGORY_COLOR[author.category]}}/>
                                                    {t("common:bookCount", {count: author.bookCount})}
                                                </span>
                                            </span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
            </div>
        </section>
    );
};
