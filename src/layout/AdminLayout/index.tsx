import {useState, useSyncExternalStore} from "react";
import {Navigate, Outlet, useLocation} from "react-router";
import {ChevronLeft, Menu} from "lucide-react";
import {useTranslation} from "react-i18next";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {ADMIN_NAV_GROUPS} from "@/constants/sidebar";
import {ROUTES} from "@/constants/routes";
import {useIsMobile} from "@/hooks/_shared/useMediaQuery";
import {useOrderFeed} from "@/hooks/admin";
import {useAuth} from "@/hooks/useAuth";
import {useHotkey} from "@/hooks/useHotkey";
import {AdminSidebar} from "@/layout/AdminLayout/Sidebar";
import {createPersistentStore} from "@/lib/persistentStore";
import {MOD_KEY} from "@/lib/platform";
import {cn} from "@/lib/utils";
import {Logo} from "@/widgets/Logo";
import {Sheet} from "@/widgets/Sheet";

const collapsedStore = createPersistentStore<boolean>("folio.adminSidebar", false, (value): value is boolean => typeof value === "boolean");

/** The tab whose page is open, for the top bar: the longest matching path wins, so /admin/books/x names "Books". */
const sectionLabel = (pathname: string): string | undefined =>
    ADMIN_NAV_GROUPS.flatMap((group) => group.items)
        .filter((item) => item.to !== ROUTES.HOME && (pathname === item.to || pathname.startsWith(`${item.to}/`)))
        .sort((a, b) => b.to.length - a.to.length)[0]?.labelKey;

/**
 * The admin shell, NextCook style: a floating sidebar card that folds into an icon rail (Ctrl B), a drawer on phones,
 * and a slim top bar naming the section. Admin rights are checked by the route loader; signing out here leaves.
 */
export const AdminLayout = () => {
    const {t} = useTranslation("admin");
    const {pathname} = useLocation();
    const {user, isReady} = useAuth();
    const isMobile = useIsMobile();
    const collapsed = useSyncExternalStore(collapsedStore.subscribe, collapsedStore.get, collapsedStore.get);
    const [drawerPath, setDrawerPath] = useState<string | null>(null);
    const isDrawerOpen = drawerPath === pathname;
    const toggleCollapsed = () => collapsedStore.set((value) => !value);

    useOrderFeed(Boolean(user));
    useHotkey("b", () => (isMobile ? setDrawerPath(isDrawerOpen ? null : pathname) : toggleCollapsed()));

    if (isReady && !user) return <Navigate to={ROUTES.HOME} replace/>;

    const section = sectionLabel(pathname);

    return (
        <div className="flex min-h-dvh bg-background">
            {!isMobile && (
                <aside className={cn("sticky top-0 z-40 h-dvh shrink-0 py-3 pl-3 transition-[width] duration-300 ease-out", collapsed ? "w-[5.25rem]" : "w-[17.5rem]")}>
                    <div className="h-full overflow-hidden rounded-2xl border border-sidebar-border bg-sidebar shadow-sm">
                        <AdminSidebar collapsed={collapsed}/>
                    </div>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                type="button"
                                onClick={toggleCollapsed}
                                aria-label={t("nav.toggle")}
                                aria-pressed={collapsed}
                                className="absolute right-0 top-[2.85rem] flex size-6 -translate-y-1/2 translate-x-1/2 cursor-pointer items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-sidebar-muted shadow-sm outline-none transition-[border-color,color] duration-200 hover:border-brand/50 hover:text-brand focus-visible:ring-2 focus-visible:ring-brand/40"
                            >
                                <ChevronLeft className={cn("size-3.5 transition-transform duration-300", collapsed && "rotate-180")}/>
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="right">{t("nav.toggle")} · {MOD_KEY} B</TooltipContent>
                    </Tooltip>
                </aside>
            )}

            <Sheet open={isMobile && isDrawerOpen} onOpenChange={(open) => setDrawerPath(open ? pathname : null)} title={t("nav.panel")}>
                <AdminSidebar collapsed={false} onNavigate={() => setDrawerPath(null)}/>
            </Sheet>

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 bg-background/85 px-4 backdrop-blur-md md:px-8">
                    {isMobile && (
                        <>
                            <button type="button" onClick={() => setDrawerPath(pathname)} aria-label={t("nav.open")} className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-foreground hover:bg-accent-soft">
                                <Menu className="size-5 stroke-[1.5]"/>
                            </button>
                            <Logo compact className="[&_svg]:size-8"/>
                        </>
                    )}
                    <span className="hidden text-sm text-faint-foreground sm:inline">{t("nav.panel")} /</span>
                    <span key={section} className="animate-fade-in truncate text-sm font-medium">{section ? t(section as never) : ""}</span>
                </header>

                <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 pb-16 pt-2 md:px-8">
                    <div key={pathname} className="page-enter">
                        <Outlet/>
                    </div>
                </main>
            </div>
        </div>
    );
};
