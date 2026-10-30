import {useMemo, useState} from "react";
import {Link} from "react-router";
import {Plus, Search} from "lucide-react";
import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Skeleton} from "@/components/ui/skeleton";
import {CATEGORY_COLOR, CATEGORY_IDS, type CategoryId} from "@/constants/catalog";
import {buildRoute, NEW_ID} from "@/constants/routes";
import {formatPrice} from "@/helpers/format";
import {useGetBooks} from "@/hooks/books";
import {useLanguage} from "@/hooks/useLanguage";
import {preloadRoute} from "@/router/preload";
import {BookCover} from "@/widgets/BookCover";
import {EmptyState} from "@/widgets/EmptyState";
import {PageTitle} from "@/widgets/PageTitle";
import {QueryErrorState} from "@/widgets/QueryErrorState";
import {cn} from "@/lib/utils";

/** The catalogue as a table: cover, title, category, price and stock; a row opens the book's form. */
export const AdminBooksPage = () => {
    const {t} = useTranslation(["admin", "common"]);
    const {language, pick} = useLanguage();
    const [category, setCategory] = useState<CategoryId | undefined>();
    const [query, setQuery] = useState("");
    const {items: books, isLoading, isError, refetch} = useGetBooks({category, query: query.trim() || undefined, sort: "featured"});
    const total = useMemo(() => books.reduce((sum, book) => sum + book.stock, 0), [books]);

    return (
        <section>
            <PageTitle
                title={t("books.title")}
                description={t("books.subtitle", {count: books.length, stock: total})}
                actions={<Button asChild variant="accent" className="rounded-full"><Link to={buildRoute.adminBook(NEW_ID)}><Plus/>{t("books.new")}</Link></Button>}
            />

            <div className="mt-8 flex flex-wrap items-center gap-3">
                <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1">
                    {[undefined, ...CATEGORY_IDS].map((id) => (
                        <button
                            key={id ?? "all"}
                            type="button"
                            onClick={() => setCategory(id)}
                            aria-pressed={category === id}
                            className={cn("flex h-8 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border px-3 text-[13px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/40", category === id ? "border-accent bg-accent-soft text-accent-bright" : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground")}
                        >
                            {id && <span className="size-2 rounded-[2px]" style={{background: CATEGORY_COLOR[id]}}/>}
                            {id ? t(`common:categories.${id}`) : t("orders.all")}
                        </button>
                    ))}
                </div>
                <div className="relative w-full sm:w-72">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
                    <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("books.search")} className="pl-9" aria-label={t("books.search")}/>
                </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface">
                <div className="hidden grid-cols-[3rem_minmax(0,1fr)_9rem_6rem_5rem_6rem] gap-4 border-b border-border px-5 py-2.5 text-[10.5px] font-medium uppercase tracking-[0.18em] text-muted-foreground md:grid">
                    <span/><span>{t("books.columns.title")}</span><span>{t("books.columns.category")}</span><span className="text-right">{t("books.columns.price")}</span><span className="text-right">{t("books.columns.stock")}</span><span>{t("books.columns.tag")}</span>
                </div>
                {isLoading ? <div className="space-y-2 p-4">{[0, 1, 2, 3, 4].map((key) => <Skeleton key={key} className="h-14"/>)}</div>
                    : isError ? <div className="p-4"><QueryErrorState onRetry={() => void refetch()}/></div>
                    : books.length === 0 ? <EmptyState className="m-4" title={t("books.noMatch")}/>
                    : (
                        <ul className="divide-y divide-border">
                            {books.map((book) => (
                                <li key={book.id}>
                                    <Link
                                        to={buildRoute.adminBook(book.id)}
                                        onPointerEnter={() => preloadRoute(buildRoute.adminBook(book.id))}
                                        className="grid grid-cols-[2.75rem_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 px-5 py-2.5 outline-none transition-colors hover:bg-accent-soft/40 focus-visible:bg-accent-soft/40 md:grid-cols-[3rem_minmax(0,1fr)_9rem_6rem_5rem_6rem] md:gap-4"
                                    >
                                        <span className="row-span-2 md:row-span-1"><BookCover book={book} author={book.author}/></span>
                                        <span className="min-w-0">
                                            <span className="block truncate font-serif text-[17px] leading-tight">{pick(book.title)}</span>
                                            <span className="block truncate text-xs text-muted-foreground">{pick(book.author.name)} · {book.year < 0 ? `${-book.year} BC` : book.year}</span>
                                        </span>
                                        <span className="hidden items-center gap-2 text-sm text-muted-foreground md:flex"><span className="size-2 rounded-[2px]" style={{background: CATEGORY_COLOR[book.category]}}/>{t(`common:categories.${book.category}`)}</span>
                                        <span className="tabular text-right text-sm text-accent-bright max-md:col-start-3 max-md:row-start-1">{formatPrice(book.price, language)}</span>
                                        <span className={cn("tabular text-right text-sm max-md:col-start-3 max-md:row-start-2 max-md:text-xs", book.stock === 0 ? "text-danger" : book.stock <= 5 ? "text-accent-bright" : "text-muted-foreground")}>{book.stock}</span>
                                        <span className="hidden text-xs text-muted-foreground md:block">{book.tag ? t(`common:tags.${book.tag}`) : "—"}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
            </div>
        </section>
    );
};
