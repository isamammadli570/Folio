import {useMemo, useState, type CSSProperties} from "react";
import {Link} from "react-router";
import {ChevronDown} from "lucide-react";
import {useTranslation} from "react-i18next";
import type {BookWithAuthor, Order, OrderStatus} from "@/api/types";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {buildRoute, ROUTES} from "@/constants/routes";
import {formatDate, formatPrice} from "@/helpers/format";
import {useGetOrders} from "@/hooks/account";
import {useGetBooks} from "@/hooks/books";
import {useLanguage} from "@/hooks/useLanguage";
import {BookCover} from "@/widgets/BookCover";
import {EmptyState} from "@/widgets/EmptyState";
import {PageTitle} from "@/widgets/PageTitle";
import {QueryErrorState} from "@/widgets/QueryErrorState";
import {cn} from "@/lib/utils";

const PROGRESS: OrderStatus[] = ["new", "processing", "shipped", "delivered"];

/** Four beads on a thread: how far the order has come. A cancelled order shows its status alone. */
const StatusTrack = ({status}: {status: OrderStatus}) => {
    const {t} = useTranslation("account");
    const reached = PROGRESS.indexOf(status);
    if (status === "cancelled") return <span className="rounded-full border border-danger/50 px-2.5 py-1 text-xs text-danger">{t("orders.status.cancelled")}</span>;
    return (
        <div className="flex items-center gap-3">
            <ol className="flex items-center" aria-hidden>
                {PROGRESS.map((step, index) => (
                    <li key={step} className="flex items-center">
                        {index > 0 && <span className={cn("h-px w-5", index <= reached ? "bg-accent" : "bg-border-strong")}/>}
                        <span className={cn("size-2 rotate-45 border", index <= reached ? "border-accent bg-accent" : "border-border-strong", index === reached && "animate-icon-pop")}/>
                    </li>
                ))}
            </ol>
            <span className="text-xs text-accent-bright">{t(`orders.status.${status}`)}</span>
        </div>
    );
};

const OrderCard = ({order, books, index}: {order: Order; books: BookWithAuthor[]; index: number}) => {
    const {t} = useTranslation("account");
    const {t: tc} = useTranslation("cart");
    const {language} = useLanguage();
    const [open, setOpen] = useState(index === 0);
    const count = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const covers = order.items.flatMap((item) => books.filter((book) => book.id === item.bookId)).slice(0, 4);

    return (
        <li className="animate-fade-up border border-border transition-colors hover:border-border-strong" style={{animationDelay: `${index * 70}ms`} as CSSProperties}>
            <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} className="flex w-full cursor-pointer flex-wrap items-center gap-x-6 gap-y-4 p-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/40 sm:p-6">
                <span className="flex -space-x-5">
                    {covers.map((book, coverIndex) => (
                        <span key={book.id} className="w-11 shadow-[0_6px_14px_-6px_rgb(var(--shade)/0.8)]" style={{zIndex: covers.length - coverIndex, transform: `rotate(${(coverIndex - 1) * 4}deg)`}}>
                            <BookCover book={book} author={book.author}/>
                        </span>
                    ))}
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block font-serif text-[22px] leading-tight">{order.number}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{t("orders.placedOn", {date: formatDate(order.createdAt, language)})} · {t("orders.items", {count})}</span>
                </span>
                <StatusTrack status={order.status}/>
                <span className="tabular font-serif text-[22px] text-accent-bright">{formatPrice(order.total, language)}</span>
                <ChevronDown className={cn("size-4 text-muted-foreground transition-transform duration-300", open && "rotate-180")}/>
            </button>

            <div className={cn("grid transition-[grid-template-rows] duration-300 ease-out", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                <div className="overflow-hidden">
                    <div className="grid gap-8 border-t border-border p-5 sm:p-6 md:grid-cols-[minmax(0,1fr)_16rem]">
                        <ul className="divide-y divide-border">
                            {order.items.map((item) => (
                                <li key={item.bookId} className="flex items-baseline justify-between gap-4 py-3 first:pt-0">
                                    <Link to={buildRoute.book(item.bookId)} className="min-w-0 truncate font-serif text-lg hover:text-accent-bright">{item.title[language]}</Link>
                                    <span className="tabular shrink-0 text-sm text-muted-foreground">{item.quantity} × {formatPrice(item.unitPrice, language)}</span>
                                </li>
                            ))}
                        </ul>
                        <dl className="space-y-2 text-sm">
                            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">{t("orders.subtotal")}</dt><dd className="tabular">{formatPrice(order.subtotal, language)}</dd></div>
                            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">{t("orders.shipping")}</dt><dd className="tabular">{order.shipping === 0 ? t("orders.free") : formatPrice(order.shipping, language)}</dd></div>
                            <div className="flex justify-between gap-4 border-t border-border pt-2 font-medium"><dt>{t("orders.total")}</dt><dd className="tabular text-accent-bright">{formatPrice(order.total, language)}</dd></div>
                            <div className="pt-4 text-xs leading-relaxed text-muted-foreground">
                                <p><span className="text-foreground">{t("orders.deliverTo")}:</span> {order.deliveryMethod === "courier" ? `${order.city}, ${order.address}` : tc("checkout.methods.pickupHint")}</p>
                                <p className="mt-1"><span className="text-foreground">{t("orders.payment")}:</span> {tc(`checkout.payments.${order.paymentMethod}`)}</p>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </li>
    );
};

export const OrdersPage = () => {
    const {t} = useTranslation("account");
    const {items: orders, isLoading, isError, refetch} = useGetOrders();
    const ids = useMemo(() => [...new Set(orders.flatMap((order) => order.items.map((item) => item.bookId)))], [orders]);
    const {items: books} = useGetBooks({ids}, ids.length > 0);

    return (
        <section>
            <PageTitle title={t("orders.title")} description={t("orders.subtitle")}/>
            {isLoading ? (
                <div className="mt-10 space-y-4">{[0, 1, 2].map((key) => <Skeleton key={key} className="h-24"/>)}</div>
            ) : isError ? (
                <div className="mt-10"><QueryErrorState onRetry={() => void refetch()}/></div>
            ) : orders.length === 0 ? (
                <EmptyState
                    className="mt-10"
                    quote={{text: t("orders.emptyQuote"), cite: "Folio"}}
                    title={t("orders.empty")}
                    action={<Button asChild variant="outline"><Link to={ROUTES.CATALOG}>{t("orders.emptyAction")}</Link></Button>}
                />
            ) : (
                <ul className="mt-10 space-y-4">
                    {orders.map((order, index) => <OrderCard key={order.id} order={order} books={books} index={index}/>)}
                </ul>
            )}
        </section>
    );
};
