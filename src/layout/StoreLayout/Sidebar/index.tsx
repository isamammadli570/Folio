import {LogIn, Search, UserRound} from "lucide-react";
import {useLocation} from "react-router";
import {useTranslation} from "react-i18next";
import {Kbd} from "@/components/ui/kbd";
import {NavGroupSection} from "@/layout/StoreLayout/Sidebar/NavGroupSection";
import {NavItemLink} from "@/layout/StoreLayout/Sidebar/NavItemLink";
import {CartStatusCard} from "@/layout/StoreLayout/Sidebar/CartStatusCard";
import {NAV_GROUPS} from "@/constants/sidebar";
import {ROUTES} from "@/constants/routes";
import {useGetCategoryCounts} from "@/hooks/books";
import {useAuth} from "@/hooks/useAuth";
import {Logo} from "@/widgets/Logo";
import {OrnamentDivider} from "@/widgets/OrnamentDivider";
import {LanguageSwitcher} from "@/widgets/LanguageSwitcher";
import {MOD_KEY} from "@/lib/platform";

type SidebarProps = {
    onOpenSearch: () => void;
    onNavigate: () => void;
};

/** A link is active when its path matches; category links also need the same `?category=`. */
const isActiveLink = (to: string, pathname: string, search: string): boolean => {
    const [path, query] = to.split("?");
    if (query) return pathname === path && new URLSearchParams(search).get("category") === new URLSearchParams(query).get("category");
    if (path === ROUTES.HOME) return pathname === ROUTES.HOME;
    if (path === ROUTES.CATALOG) return pathname.startsWith(ROUTES.CATALOG) && !new URLSearchParams(search).get("category");
    return pathname === path || pathname.startsWith(`${path}/`);
};

/** The NextCook-style navigation card, in Folio's bronze and gold; it opens from the left on phones and tablets. */
export const Sidebar = ({onOpenSearch, onNavigate}: SidebarProps) => {
    const {t} = useTranslation();
    const {pathname, search} = useLocation();
    const {data: counts} = useGetCategoryCounts();
    const {user} = useAuth();
    const accountItem = user
        ? {labelKey: "header.account", to: ROUTES.ACCOUNT, icon: UserRound}
        : {labelKey: "header.signIn", to: ROUTES.LOGIN, icon: LogIn};

    return (
        <div className="flex h-full min-h-0 flex-col">
            <div className="flex flex-col gap-4 p-4 pb-3">
                <div className="flex items-center justify-between gap-3">
                    <Logo/>
                    <LanguageSwitcher/>
                </div>
                <button
                    type="button"
                    onClick={onOpenSearch}
                    className="flex h-10 w-full cursor-pointer items-center gap-2 rounded-xl border border-sidebar-border bg-surface/60 px-3 text-sm text-sidebar-muted outline-none transition-[border-color,color] duration-200 hover:border-brand/40 hover:text-brand-ink focus-visible:ring-2 focus-visible:ring-brand/40"
                >
                    <Search className="size-4 stroke-[1.6]"/>
                    <span className="flex-1 text-left">{t("header.search")}</span>
                    <Kbd>{MOD_KEY} K</Kbd>
                </button>
            </div>

            <OrnamentDivider className="px-5 py-1"/>

            <nav aria-label={t("nav.books")} className="scroll-thin min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 pb-3 pt-3">
                {NAV_GROUPS.map((group) => (
                    <NavGroupSection key={group.id} group={group}>
                        {group.items.map((item, index) => (
                            <NavItemLink
                                key={item.to}
                                item={item}
                                index={index}
                                isActive={isActiveLink(item.to, pathname, search)}
                                badge={item.category ? counts?.[item.category] : undefined}
                                onNavigate={onNavigate}
                            />
                        ))}
                    </NavGroupSection>
                ))}
                <ul className="mt-2 border-t border-sidebar-border pt-3">
                    <NavItemLink item={accountItem} index={0} isActive={isActiveLink(accountItem.to, pathname, search)} onNavigate={onNavigate}/>
                </ul>
            </nav>

            <CartStatusCard onOpen={onNavigate}/>
        </div>
    );
};
