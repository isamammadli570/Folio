import {useMemo, useState} from "react";
import {ChevronDown, Search} from "lucide-react";
import {useTranslation} from "react-i18next";
import type {Order, OrderStatus} from "@/api/types";
import {Input} from "@/components/ui/input";
import {Skeleton} from "@/components/ui/skeleton";
import {formatDate, formatPrice} from "@/helpers/format";
import {useGetAllOrders, useUpdateOrderStatus} from "@/hooks/admin";
import {useLanguage} from "@/hooks/useLanguage";
import {EmptyState} from "@/widgets/EmptyState";
import {PageTitle} from "@/widgets/PageTitle";
import {QueryErrorState} from "@/widgets/QueryErrorState";
import {StatusBadge} from "@/widgets/StatusBadge";
import {cn} from "@/lib/utils";

const STATUSES: OrderStatus[] = ["new", "processing", "shipped", "delivered", "cancelled"];

const OrderRow = ({order}: {order: Order}) => {
    const {t} = useTranslation(["admin", "account", "cart"]);
    const {language} = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const update = useUpdateOrderStatus();
    const count = order.items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <li className="border-b border-border last:border-b-0">
            <button type="button" onClick={() => setIsOpen((open) => !open)} aria-expanded={isOpen} className="grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 px-5 py-3.5 text-left outline-none transition-colors hover:bg-accent-soft/40 focus-visible:bg-accent-soft/40 md:grid-cols-[9rem_minmax(0,1fr)_8rem_7rem_6rem_1rem]">
                <span className="font-serif text-[17px]">{order.number}</span>
                <span className="min-w-0 max-md:col-span-2 max-md:row-start-2">
                    <span className="block truncate text-sm">{order.firstName} {order.lastName}</span>
                    <span className="block truncate text-xs text-muted-foreground">{order.email} · {order.phone}</span>
                </span>
                <span className="text-xs text-muted-foreground max-md:hidden">{formatDate(order.createdAt, language)}</span>
                <span className="max-md:col-start-2 max-md:row-start-1 max-md:justify-self-end"><StatusBadge status={order.status}/></span>
                <span className="tabular text-right text-sm text-accent-bright max-md:hidden">{formatPrice(order.total, language)}</span>
                <ChevronDown className={cn("size-4 text-muted-foreground transition-transform duration-300 max-md:hidden", isOpen && "rotate-180")}/>
            </button>

            <div className={cn("grid transition-[grid-template-rows] duration-300 ease-out", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                <div className="overflow-hidden">
                    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 bg-surface/60 px-5 pb-5 pt-2 md:grid-cols-[minmax(0,1fr)_17rem]">
                        <div className="min-w-0">
                            <p className="text-[10.5px] font-medium uppercase tracking-[0.2em] text-muted-foreground">{t("account:orders.items", {count})}</p>
                            <ul className="mt-2 divide-y divide-border">
                                {order.items.map((item) => (
                                    <li key={item.bookId} className="flex items-baseline justify-between gap-4 py-2">
                                        <span className="min-w-0 truncate font-serif text-[16px]">{item.title[language]}</span>
                                        <span className="tabular shrink-0 text-sm text-muted-foreground">{item.quantity} × {formatPrice(item.unitPrice, language)}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                                <span className="text-foreground">{t("account:orders.deliverTo")}:</span> {order.deliveryMethod === "courier" ? `${order.city}, ${order.address}` : t("cart:checkout.methods.pickup")}
                                {order.note && <> · {order.note}</>}
                                <br/><span className="text-foreground">{t("account:orders.payment")}:</span> {t(`cart:checkout.payments.${order.paymentMethod}`)}
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <dl className="space-y-1.5 text-sm">
                                <div className="flex justify-between"><dt className="text-muted-foreground">{t("account:orders.subtotal")}</dt><dd className="tabular">{formatPrice(order.subtotal, language)}</dd></div>
                                <div className="flex justify-between"><dt className="text-muted-foreground">{t("account:orders.shipping")}</dt><dd className="tabular">{order.shipping === 0 ? t("account:orders.free") : formatPrice(order.shipping, language)}</dd></div>
                                <div className="flex justify-between border-t border-border pt-1.5 font-medium"><dt>{t("account:orders.total")}</dt><dd className="tabular text-accent-bright">{formatPrice(order.total, language)}</dd></div>
                            </dl>
                            <label className="flex flex-col gap-1.5 text-[13px] font-medium">
                                {t("orders.changeStatus")}
                                <select
                                    value={order.status}
                                    disabled={update.isPending}
                                    onChange={(event) => update.mutate({orderId: order.id, status: event.target.value as OrderStatus})}
                                    className="h-10 cursor-pointer rounded-lg border border-border bg-surface px-3 text-sm font-normal outline-none focus:border-foreground disabled:opacity-60"
                                >
                                    {STATUSES.map((status) => <option key={status} value={status}>{t(`account:orders.status.${status}`)}</option>)}
                                </select>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
};

/** Every order in the shop, filtered by status and searchable by number, name, email or phone. */
export const AdminOrdersPage = () => {
    const {t} = useTranslation(["admin", "account"]);
    const {items: orders, isLoading, isError, refetch} = useGetAllOrders();
    const [status, setStatus] = useState<OrderStatus | "all">("all");
    const [query, setQuery] = useState("");

    const counts = useMemo(() => Object.fromEntries(STATUSES.map((item) => [item, orders.filter((order) => order.status === item).length])) as Record<OrderStatus, number>, [orders]);
    const visible = useMemo(() => {
        const needle = query.trim().toLowerCase();
        return orders.filter((order) =>
            (status === "all" || order.status === status)
            && (!needle || [order.number, order.firstName, order.lastName, order.email, order.phone].join(" ").toLowerCase().includes(needle)));
    }, [orders, status, query]);

    const chip = (value: OrderStatus | "all", label: string, count: number) => (
        <button
            key={value}
            type="button"
            onClick={() => setStatus(value)}
            aria-pressed={status === value}
            className={cn("flex h-8 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border px-3 text-[13px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/40", status === value ? "border-accent bg-accent-soft text-accent-bright" : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground")}
        >
            {label}<span className="tabular text-[11px] opacity-70">{count}</span>
        </button>
    );

    return (
        <section>
            <PageTitle title={t("orders.title")} description={t("orders.subtitle")}/>
            <div className="mt-8 flex flex-wrap items-center gap-3">
                <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1">
                    {chip("all", t("orders.all"), orders.length)}
                    {STATUSES.map((item) => chip(item, t(`account:orders.status.${item}`), counts[item]))}
                </div>
                <div className="relative w-full sm:w-72">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
                    <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("orders.search")} className="pl-9" aria-label={t("orders.search")}/>
                </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface">
                {isLoading ? <div className="space-y-2 p-4">{[0, 1, 2, 3].map((key) => <Skeleton key={key} className="h-12"/>)}</div>
                    : isError ? <div className="p-4"><QueryErrorState onRetry={() => void refetch()}/></div>
                    : visible.length === 0 ? <EmptyState className="m-4" title={orders.length === 0 ? t("orders.empty") : t("orders.noMatch")}/>
                    : <ul>{visible.map((order) => <OrderRow key={order.id} order={order}/>)}</ul>}
            </div>
        </section>
    );
};
