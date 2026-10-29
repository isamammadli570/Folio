import {Navigate, Outlet, useLocation} from "react-router";
import {LogOut} from "lucide-react";
import {useTranslation} from "react-i18next";
import {ACCOUNT_LINKS} from "@/constants/sidebar";
import {ROUTES} from "@/constants/routes";
import {useGetOrders, useSignOut} from "@/hooks/account";
import {useAuth} from "@/hooks/useAuth";
import {useFavorites} from "@/hooks/useFavorites";
import {NavItemLink} from "@/layout/StoreLayout/Sidebar/NavItemLink";
import {Page} from "@/widgets/Page";

const initials = (name: string, email: string): string =>
    (name.trim() ? name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("") : email[0] ?? "?").toLocaleUpperCase();

/**
 * The reader's own pages beside a compact sidebar: who is signed in, the tabs, and signing out. On phones the tabs become
 * a row that scrolls sideways above the page.
 */
export const AccountLayout = () => {
    const {t} = useTranslation("account");
    const {pathname} = useLocation();
    const {user, isReady} = useAuth();
    const {ids: favoriteIds} = useFavorites();
    const {items: orders} = useGetOrders();
    const signOut = useSignOut();

    // Signing out in another tab (or here) leaves nothing to show.
    if (isReady && !user) return <Navigate to={`${ROUTES.LOGIN}?next=${encodeURIComponent(pathname)}`} replace/>;

    const name = (user?.user_metadata as {full_name?: string} | undefined)?.full_name ?? "";
    const email = user?.email ?? "";
    const badges: Record<string, number> = {[ROUTES.ACCOUNT]: orders.length, [ROUTES.FAVORITES]: favoriteIds.length};

    return (
        <Page className="grid items-start gap-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-14">
            <aside className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
                <div className="flex items-center gap-3.5 border-b border-border pb-6">
                    <span className="relative flex size-12 shrink-0 items-center justify-center rounded-full border border-accent/60 font-serif text-lg text-accent-bright">
                        <span aria-hidden className="absolute inset-1 rounded-full border border-accent/20"/>
                        {initials(name, email)}
                    </span>
                    <div className="min-w-0">
                        <p className="truncate font-serif text-xl leading-tight">{t("nav.greeting", {name: name.split(" ")[0] || t("nav.reader")})}</p>
                        <p className="truncate text-xs text-muted-foreground">{email}</p>
                    </div>
                </div>

                <nav aria-label={t("nav.title")} className="mt-5">
                    <ul className="stagger flex gap-1 overflow-x-auto pb-1 max-lg:-mx-1 max-lg:px-1 lg:flex-col [&>li]:shrink-0">
                        {ACCOUNT_LINKS.map((item, index) => (
                            <NavItemLink key={item.to} item={item} index={index} isActive={pathname === item.to} badge={badges[item.to]}/>
                        ))}
                    </ul>
                </nav>

                <button
                    type="button"
                    onClick={() => signOut.mutate()}
                    disabled={signOut.isPending}
                    className="mt-6 hidden w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] text-muted-foreground outline-none transition-colors hover:text-danger focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-50 lg:flex"
                >
                    <LogOut className="size-[18px] stroke-[1.5]"/>
                    {t("nav.signOut")}
                </button>
            </aside>

            <div className="min-w-0">
                <Outlet/>
                <button
                    type="button"
                    onClick={() => signOut.mutate()}
                    disabled={signOut.isPending}
                    className="mt-14 flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-danger disabled:opacity-50 lg:hidden"
                >
                    <LogOut className="size-4 stroke-[1.5]"/>
                    {t("nav.signOut")}
                </button>
            </div>
        </Page>
    );
};
