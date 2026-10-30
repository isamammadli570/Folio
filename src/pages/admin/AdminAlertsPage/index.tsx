import {useMemo} from "react";
import {Link} from "react-router";
import {Copy, PackageOpen, X} from "lucide-react";
import {useTranslation} from "react-i18next";
import type {StockAlert} from "@/api/alerts.api";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {buildRoute} from "@/constants/routes";
import {formatDate} from "@/helpers/format";
import {useGetStockAlerts, useRemoveStockAlert} from "@/hooks/admin";
import {useGetBooks} from "@/hooks/books";
import {useLanguage} from "@/hooks/useLanguage";
import {copyText} from "@/lib/clipboard";
import {BookCover} from "@/widgets/BookCover";
import {EmptyState} from "@/widgets/EmptyState";
import {PageTitle} from "@/widgets/PageTitle";
import {QueryErrorState} from "@/widgets/QueryErrorState";

/**
 * Who is waiting for which sold-out book, grouped by book with the longest queue first. Once a book is restocked its
 * group says so: copy the addresses, write to them, then clear the list.
 */
export const AdminAlertsPage = () => {
    const {t} = useTranslation("admin");
    const {language, pick} = useLanguage();
    const {items: alerts, isLoading, isError, refetch} = useGetStockAlerts();
    const remove = useRemoveStockAlert();

    const groups = useMemo(() => {
        const byBook = new Map<string, StockAlert[]>();
        for (const alert of alerts) byBook.set(alert.bookId, [...(byBook.get(alert.bookId) ?? []), alert]);
        return [...byBook.entries()].sort((a, b) => b[1].length - a[1].length);
    }, [alerts]);
    const ids = useMemo(() => groups.map(([bookId]) => bookId), [groups]);
    const {items: books} = useGetBooks({ids}, ids.length > 0);
    const bookById = new Map(books.map((book) => [book.id, book]));

    return (
        <section>
            <PageTitle title={t("alerts.title")} description={t("alerts.subtitle")}/>

            <div className="mt-8 flex flex-col gap-4">
                {isLoading ? [0, 1].map((key) => <Skeleton key={key} className="h-32 rounded-xl"/>)
                    : isError ? <QueryErrorState onRetry={() => void refetch()}/>
                    : groups.length === 0 ? <EmptyState title={t("alerts.empty")}/>
                    : groups.map(([bookId, waiting]) => {
                        const book = bookById.get(bookId);
                        const isBack = (book?.stock ?? 0) > 0;
                        return (
                            <article key={bookId} className="rounded-xl border border-border bg-surface p-5">
                                <div className="flex flex-wrap items-center gap-4">
                                    {book && <span className="w-11 shrink-0"><BookCover book={book} author={book.author}/></span>}
                                    <div className="min-w-0 flex-1">
                                        <Link to={buildRoute.adminBook(bookId)} className="block truncate font-serif text-xl hover:text-accent-bright">{book ? pick(book.title) : bookId}</Link>
                                        <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                            {t("alerts.waiting", {count: waiting.length})}
                                            {isBack ? <Badge tone="success"><PackageOpen className="size-3"/>{t("alerts.back", {count: book?.stock})}</Badge> : <Badge tone="danger">{t("alerts.soldOut")}</Badge>}
                                        </p>
                                    </div>
                                    <Button variant="outline" size="sm" className="rounded-full" onClick={() => void copyText(waiting.map((item) => item.email).join(", "), "admin:alerts.copied")}>
                                        <Copy/>{t("alerts.copy")}
                                    </Button>
                                </div>
                                <ul className="mt-4 flex flex-wrap gap-2">
                                    {waiting.map((item) => (
                                        <li key={item.id} className="flex items-center gap-1.5 rounded-full border border-border py-1 pl-3 pr-1 text-xs">
                                            <span className="truncate">{item.email}</span>
                                            <span className="text-faint-foreground">{item.language.toUpperCase()} · {formatDate(item.createdAt, language)}</span>
                                            <button
                                                type="button"
                                                onClick={() => remove.mutate(item.id)}
                                                disabled={remove.isPending}
                                                aria-label={t("alerts.remove", {email: item.email})}
                                                className="cursor-pointer rounded-full p-1 text-muted-foreground hover:bg-danger/10 hover:text-danger disabled:opacity-50"
                                            >
                                                <X className="size-3"/>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        );
                    })}
            </div>
        </section>
    );
};
