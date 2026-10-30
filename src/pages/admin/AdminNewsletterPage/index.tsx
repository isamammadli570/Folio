import {useMemo, useState} from "react";
import {Copy, Mails, Search, Trash2} from "lucide-react";
import {useTranslation} from "react-i18next";
import type {Subscriber} from "@/api/newsletter.api";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Skeleton} from "@/components/ui/skeleton";
import {formatDate} from "@/helpers/format";
import {useGetSubscribers, useRemoveSubscriber} from "@/hooks/admin";
import {useLanguage} from "@/hooks/useLanguage";
import {copyText} from "@/lib/clipboard";
import {ConfirmDialog} from "@/widgets/ConfirmDialog";
import {EmptyState} from "@/widgets/EmptyState";
import {PageTitle} from "@/widgets/PageTitle";
import {QueryErrorState} from "@/widgets/QueryErrorState";
import {StatCard} from "@/widgets/StatCard";

/** Everyone who signed up for the quote of the week: search, copy all addresses at once, or remove one. */
export const AdminNewsletterPage = () => {
    const {t} = useTranslation("admin");
    const {language} = useLanguage();
    const {items: subscribers, isLoading, isError, refetch} = useGetSubscribers();
    const remove = useRemoveSubscriber();
    const [query, setQuery] = useState("");
    const [removing, setRemoving] = useState<Subscriber | null>(null);

    const visible = useMemo(() => {
        const needle = query.trim().toLowerCase();
        return needle ? subscribers.filter((item) => item.email.includes(needle)) : subscribers;
    }, [subscribers, query]);
    const thisMonth = useMemo(() => {
        const now = new Date();
        return subscribers.filter((item) => {
            const date = new Date(item.createdAt);
            return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
        }).length;
    }, [subscribers]);

    return (
        <section>
            <PageTitle
                title={t("newsletter.title")}
                description={t("newsletter.subtitle")}
                actions={subscribers.length > 0 && (
                    <Button variant="outline" className="rounded-full" onClick={() => void copyText(subscribers.map((item) => item.email).join(", "), "admin:newsletter.copied")}>
                        <Copy/>{t("newsletter.copyAll")}
                    </Button>
                )}
            />

            <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2">
                <StatCard index={0} icon={<Mails/>} label={t("newsletter.total")} value={isLoading ? "—" : subscribers.length}/>
                <StatCard index={1} icon={<Mails/>} label={t("newsletter.thisMonth")} value={isLoading ? "—" : thisMonth}/>
            </div>

            <div className="relative mt-6 w-full sm:w-80">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
                <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("newsletter.search")} className="pl-9" aria-label={t("newsletter.search")}/>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface">
                {isLoading ? <div className="space-y-2 p-4">{[0, 1, 2].map((key) => <Skeleton key={key} className="h-11"/>)}</div>
                    : isError ? <div className="p-4"><QueryErrorState onRetry={() => void refetch()}/></div>
                    : visible.length === 0 ? <EmptyState className="m-4" title={subscribers.length === 0 ? t("newsletter.empty") : t("newsletter.noMatch")}/>
                    : (
                        <ul className="divide-y divide-border">
                            {visible.map((item) => (
                                <li key={item.id} className="flex items-center gap-3 px-5 py-3">
                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-sm">{item.email}</span>
                                        <span className="block text-xs text-muted-foreground">{formatDate(item.createdAt, language)} · {item.language.toUpperCase()}</span>
                                    </span>
                                    <Button variant="destructive-ghost" size="icon-sm" aria-label={t("newsletter.remove")} onClick={() => setRemoving(item)}><Trash2/></Button>
                                </li>
                            ))}
                        </ul>
                    )}
            </div>

            <ConfirmDialog
                open={removing !== null}
                onOpenChange={(open) => { if (!open) setRemoving(null); }}
                title={t("newsletter.removeTitle")}
                description={removing?.email}
                confirmLabel={t("newsletter.remove")}
                isPending={remove.isPending}
                onConfirm={() => removing && remove.mutate(removing.id, {onSettled: () => setRemoving(null)})}
            />
        </section>
    );
};
