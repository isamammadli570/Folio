import {useMemo, useState} from "react";
import {Copy, Search, ShoppingBag, Users, Wallet} from "lucide-react";
import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Skeleton} from "@/components/ui/skeleton";
import {formatDate, formatPrice} from "@/helpers/format";
import {useGetCustomers} from "@/hooks/admin";
import {useLanguage} from "@/hooks/useLanguage";
import {copyText} from "@/lib/clipboard";
import {EmptyState} from "@/widgets/EmptyState";
import {PageTitle} from "@/widgets/PageTitle";
import {QueryErrorState} from "@/widgets/QueryErrorState";
import {StatCard} from "@/widgets/StatCard";

/** Every reader with an account: who they are, how often they ordered and what they spent. */
export const AdminCustomersPage = () => {
    const {t} = useTranslation("admin");
    const {language} = useLanguage();
    const {items: customers, isLoading, isError, refetch} = useGetCustomers();
    const [query, setQuery] = useState("");

    const visible = useMemo(() => {
        const needle = query.trim().toLowerCase();
        if (!needle) return customers;
        return customers.filter((item) => `${item.fullName} ${item.email} ${item.phone}`.toLowerCase().includes(needle));
    }, [customers, query]);
    const buyers = customers.filter((item) => item.orders > 0).length;
    const spent = customers.reduce((sum, item) => sum + item.spent, 0);

    return (
        <section>
            <PageTitle
                title={t("customers.title")}
                description={t("customers.subtitle")}
                actions={customers.length > 0 && (
                    <Button variant="outline" className="rounded-full" onClick={() => void copyText(customers.map((item) => item.email).join(", "), "admin:customers.copied")}>
                        <Copy/>{t("customers.copyAll")}
                    </Button>
                )}
            />

            <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-3">
                <StatCard index={0} icon={<Users/>} label={t("customers.total")} value={isLoading ? "—" : customers.length}/>
                <StatCard index={1} icon={<ShoppingBag/>} label={t("customers.buyers")} value={isLoading ? "—" : buyers}/>
                <StatCard index={2} icon={<Wallet/>} label={t("customers.spent")} value={isLoading ? "—" : formatPrice(spent, language)}/>
            </div>

            <div className="relative mt-6 w-full sm:w-80">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
                <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("customers.search")} className="pl-9" aria-label={t("customers.search")}/>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface">
                {isLoading ? <div className="space-y-2 p-4">{[0, 1, 2].map((key) => <Skeleton key={key} className="h-12"/>)}</div>
                    : isError ? <div className="p-4"><QueryErrorState onRetry={() => void refetch()}/></div>
                    : visible.length === 0 ? <EmptyState className="m-4" title={customers.length === 0 ? t("customers.empty") : t("customers.noMatch")}/>
                    : (
                        <ul className="divide-y divide-border">
                            {visible.map((item) => (
                                <li key={item.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 px-5 py-3.5 md:grid-cols-[minmax(0,1fr)_9rem_6rem_7rem]">
                                    <span className="min-w-0">
                                        <span className="block truncate text-sm">{item.fullName || t("customers.noName")}</span>
                                        <span className="block truncate text-xs text-muted-foreground">{item.email}{item.phone && ` · ${item.phone}`}</span>
                                    </span>
                                    <span className="text-xs text-muted-foreground max-md:col-span-2 max-md:row-start-2">
                                        {item.lastOrderAt ? t("customers.lastOrder", {date: formatDate(item.lastOrderAt, language)}) : t("customers.joined", {date: formatDate(item.joinedAt, language)})}
                                    </span>
                                    <span className="tabular text-sm text-muted-foreground max-md:hidden">{t("customers.orders", {count: item.orders})}</span>
                                    <span className="tabular text-right text-sm text-accent-bright">{formatPrice(item.spent, language)}</span>
                                </li>
                            ))}
                        </ul>
                    )}
            </div>
        </section>
    );
};
