import {useMemo} from "react";
import {Link} from "react-router";
import {ArrowRight, BookMarked, Coins, ReceiptText, Users} from "lucide-react";
import {useTranslation} from "react-i18next";
import {Skeleton} from "@/components/ui/skeleton";
import {buildRoute, ROUTES} from "@/constants/routes";
import {orderStats, salesByDay} from "@/helpers/admin";
import {formatDate, formatPrice} from "@/helpers/format";
import {useGetAllOrders, useGetCustomerCount} from "@/hooks/admin";
import {useGetBooks} from "@/hooks/books";
import {useAuth} from "@/hooks/useAuth";
import {useLanguage} from "@/hooks/useLanguage";
import {SalesChart} from "@/pages/admin/AdminDashboardPage/widgets/SalesChart";
import {BookCover} from "@/widgets/BookCover";
import {PageTitle} from "@/widgets/PageTitle";
import {QueryErrorState} from "@/widgets/QueryErrorState";
import {StatCard} from "@/widgets/StatCard";
import {StatusBadge} from "@/widgets/StatusBadge";
import {userIdentity} from "@/helpers/user";

const LOW_STOCK = 5;
const CHART_DAYS = 28;

/** The first page of the panel: takings, orders, readers and stock at a glance, then what needs attention. */
export const AdminDashboardPage = () => {
    const {t} = useTranslation("admin");
    const {language, pick} = useLanguage();
    const {user} = useAuth();
    const {items: orders, isLoading, isError, refetch} = useGetAllOrders();
    const {data: customers} = useGetCustomerCount();
    const {items: books} = useGetBooks({sort: "featured"});

    const stats = useMemo(() => orderStats(orders), [orders]);
    const days = useMemo(() => salesByDay(orders, CHART_DAYS), [orders]);
    const lowStock = useMemo(() => books.filter((book) => book.stock <= LOW_STOCK).sort((a, b) => a.stock - b.stock), [books]);
    const unitsInStock = books.reduce((sum, book) => sum + book.stock, 0);
    const name = userIdentity(user).name.split(" ")[0];

    return (
        <section>
            <PageTitle eyebrow={t("nav.panel")} documentTitle={t("nav.panel")} title={t("dashboard.title", {name: name || t("nav.admin")})} description={t("dashboard.subtitle")}/>

            {isError ? <div className="mt-8"><QueryErrorState onRetry={() => void refetch()}/></div> : (
                <>
                    <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {isLoading ? [0, 1, 2, 3].map((key) => <Skeleton key={key} className="h-32 rounded-xl"/>) : (
                            <>
                                <StatCard index={0} icon={<Coins/>} label={t("dashboard.revenue")} value={formatPrice(stats.revenue, language)} hint={t("dashboard.average", {value: formatPrice(stats.average, language)})}/>
                                <StatCard index={1} icon={<ReceiptText/>} label={t("dashboard.orders")} value={stats.orders} hint={t("dashboard.newOrders", {count: stats.byStatus.new})}/>
                                <StatCard index={2} icon={<Users/>} label={t("dashboard.customers")} value={customers ?? "—"} hint={t("dashboard.customersHint")}/>
                                <StatCard index={3} icon={<BookMarked/>} label={t("dashboard.stock")} value={unitsInStock} hint={t("dashboard.lowStock", {count: lowStock.length})}/>
                            </>
                        )}
                    </div>

                    <div className="mt-4">{isLoading ? <Skeleton className="h-72 rounded-xl"/> : <SalesChart days={days}/>}</div>

                    <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                        <div className="rounded-xl border border-border bg-surface">
                            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
                                <p className="text-[10.5px] font-medium uppercase tracking-[0.2em] text-muted-foreground">{t("dashboard.recentOrders")}</p>
                                <Link to={ROUTES.ADMIN_ORDERS} className="flex items-center gap-1 text-xs text-accent hover:text-accent-bright">{t("dashboard.allOrders")}<ArrowRight className="size-3.5"/></Link>
                            </div>
                            {orders.length === 0 && !isLoading ? <p className="px-5 py-10 text-center text-sm text-muted-foreground">{t("orders.empty")}</p> : (
                                <ul className="divide-y divide-border">
                                    {orders.slice(0, 6).map((order) => (
                                        <li key={order.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3">
                                            <span className="min-w-0 flex-1">
                                                <span className="block font-serif text-[17px] leading-tight">{order.number}</span>
                                                <span className="block truncate text-xs text-muted-foreground">{order.firstName} {order.lastName} · {formatDate(order.createdAt, language)}</span>
                                            </span>
                                            <StatusBadge status={order.status}/>
                                            <span className="tabular w-24 text-right text-sm text-accent-bright">{formatPrice(order.total, language)}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="rounded-xl border border-border bg-surface">
                            <div className="border-b border-border px-5 py-4">
                                <p className="text-[10.5px] font-medium uppercase tracking-[0.2em] text-muted-foreground">{t("dashboard.runningLow", {count: LOW_STOCK})}</p>
                            </div>
                            {lowStock.length === 0 ? <p className="px-5 py-10 text-center text-sm text-muted-foreground">{t("dashboard.stockFine")}</p> : (
                                <ul className="divide-y divide-border">
                                    {lowStock.slice(0, 6).map((book) => (
                                        <li key={book.id}>
                                            <Link to={buildRoute.adminBook(book.id)} className="flex items-center gap-3 px-5 py-2.5 transition-colors hover:bg-accent-soft/50">
                                                <span className="w-8 shrink-0"><BookCover book={book} author={book.author}/></span>
                                                <span className="min-w-0 flex-1 truncate font-serif text-[16px]">{pick(book.title)}</span>
                                                <span className={book.stock === 0 ? "text-xs font-medium text-danger" : "tabular text-xs text-muted-foreground"}>{book.stock === 0 ? t("books.outOfStock") : t("books.left", {count: book.stock})}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </>
            )}
        </section>
    );
};
