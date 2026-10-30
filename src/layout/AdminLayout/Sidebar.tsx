import {Link, useLocation} from "react-router";
import {LogOut} from "lucide-react";
import {useTranslation} from "react-i18next";
import {ADMIN_NAV_GROUPS} from "@/constants/sidebar";
import {ROUTES} from "@/constants/routes";
import {useGetAllOrders} from "@/hooks/admin";
import {useSignOut} from "@/hooks/account";
import {useAuth} from "@/hooks/useAuth";
import {NavGroupSection} from "@/layout/StoreLayout/Sidebar/NavGroupSection";
import {NavItemLink} from "@/layout/StoreLayout/Sidebar/NavItemLink";
import {Logo} from "@/widgets/Logo";
import {LanguageSwitcher} from "@/widgets/LanguageSwitcher";
import {OrnamentDivider} from "@/widgets/OrnamentDivider";
import {ThemeToggle} from "@/widgets/ThemeToggle";
import {cn} from "@/lib/utils";
import {userIdentity} from "@/helpers/user";
import {UserAvatar} from "@/widgets/UserAvatar";

type AdminSidebarProps = {
    collapsed: boolean;
    onNavigate?: () => void;
};

const isActivePath = (pathname: string, to: string): boolean => (to === ROUTES.ADMIN || to === ROUTES.HOME ? pathname === to : pathname === to || pathname.startsWith(`${to}/`));

/** The admin navigation card: the mark, the grouped tabs (new orders counted on their tab) and who is signed in. */
export const AdminSidebar = ({collapsed, onNavigate}: AdminSidebarProps) => {
    const {t} = useTranslation("admin");
    const {pathname} = useLocation();
    const {user} = useAuth();
    const {items: orders} = useGetAllOrders();
    const signOut = useSignOut();

    const identity = userIdentity(user);
    const {name, email} = identity;
    const badges: Record<string, number> = {[ROUTES.ADMIN_ORDERS]: orders.filter((order) => order.status === "new").length};

    return (
        <div className="flex h-full min-h-0 flex-col">
            <div className={cn("flex items-center gap-3 p-4 pb-3", collapsed && "justify-center px-0")}>
                <Link to={ROUTES.ADMIN} onClick={onNavigate} aria-label={t("nav.dashboard")} className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand/40">
                    <Logo compact/>
                </Link>
                {!collapsed && (
                    <div className="min-w-0">
                        <p className="font-display text-[22px] font-semibold leading-none">{t("common:brand.name")}</p>
                        <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-sidebar-muted">{t("nav.panel")}</p>
                    </div>
                )}
            </div>

            <OrnamentDivider className={cn("py-1", collapsed ? "px-3" : "px-5")}/>

            <nav aria-label={t("nav.panel")} className="scroll-thin min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 pb-3 pt-3">
                {ADMIN_NAV_GROUPS.map((group) => (
                    <NavGroupSection key={group.id} group={group} collapsed={collapsed}>
                        {group.items.map((item, index) => (
                            <NavItemLink key={item.to} item={item} index={index} isActive={isActivePath(pathname, item.to)} badge={badges[item.to]} collapsed={collapsed} onNavigate={onNavigate}/>
                        ))}
                    </NavGroupSection>
                ))}
            </nav>

            <div className={cn("flex items-center gap-1 border-t border-sidebar-border px-3 pt-3", collapsed ? "flex-col" : "justify-between")}>
                <LanguageSwitcher className="h-9"/>
                <ThemeToggle className="size-9"/>
            </div>

            <div className="p-3">
                <div className={cn("flex items-center gap-3 rounded-xl border border-sidebar-border bg-surface/60 p-2.5", collapsed && "flex-col p-2")}>
                    <span className="relative shrink-0">
                        <UserAvatar identity={identity} className="size-9 text-[15px]"/>
                        <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-sidebar bg-success"/>
                    </span>
                    {!collapsed && (
                        <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13px] font-medium text-brand-ink">{name || t("nav.admin")}</span>
                            <span className="block truncate text-[11px] text-sidebar-muted">{email}</span>
                        </span>
                    )}
                    <button
                        type="button"
                        onClick={() => signOut.mutate()}
                        disabled={signOut.isPending}
                        aria-label={t("account:nav.signOut")}
                        title={t("account:nav.signOut")}
                        className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-sidebar-muted outline-none transition-colors hover:bg-danger/10 hover:text-danger focus-visible:ring-2 focus-visible:ring-brand/40 disabled:opacity-50"
                    >
                        <LogOut className="size-4 stroke-[1.6]"/>
                    </button>
                </div>
            </div>
        </div>
    );
};
