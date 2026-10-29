import {Link, useLocation} from "react-router";
import {Heart, Menu, Search, ShoppingBag, UserRound} from "lucide-react";
import {useTranslation} from "react-i18next";
import {Kbd} from "@/components/ui/kbd";
import {HEADER_LINKS} from "@/constants/sidebar";
import {ROUTES} from "@/constants/routes";
import {cartActions, useCart} from "@/hooks/useCart";
import {useFavorites} from "@/hooks/useFavorites";
import {useAuth} from "@/hooks/useAuth";
import {preloadRoute} from "@/router/preload";
import {Logo} from "@/widgets/Logo";
import {LanguageSwitcher} from "@/widgets/LanguageSwitcher";
import {ThemeToggle} from "@/widgets/ThemeToggle";
import {CART_TARGET_ATTRIBUTE} from "@/lib/flyTo";
import {MOD_KEY} from "@/lib/platform";
import {cn} from "@/lib/utils";

type HeaderProps = {
    onOpenMenu: () => void;
    onOpenSearch: () => void;
};

const iconButton = "relative flex size-10 cursor-pointer items-center justify-center rounded-full border border-border text-foreground outline-none transition-[border-color,background-color,color] duration-200 hover:border-accent hover:bg-accent-soft focus-visible:ring-2 focus-visible:ring-ring/60 [&_svg]:size-[18px] [&_svg]:stroke-[1.5]";

const Count = ({value}: {value: number}) =>
    value > 0 ? (
        <span key={value} className="tabular animate-bump absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[10.5px] font-semibold text-accent-ink">{value}</span>
    ) : null;

/** The glass bar on top of every page: logo, sections, search, language, favourites and the cart. */
export const Header = ({onOpenMenu, onOpenSearch}: HeaderProps) => {
    const {t} = useTranslation();
    const {count} = useCart();
    const {ids: favoriteIds} = useFavorites();
    const {pathname} = useLocation();
    const {user} = useAuth();
    const accountTo = user ? ROUTES.ACCOUNT : ROUTES.LOGIN;

    return (
        <>
            <div aria-hidden className="fixed inset-x-0 top-0 z-40 h-[env(safe-area-inset-top)] bg-background"/>
            <header className="sticky top-[env(safe-area-inset-top)] z-40 border-b border-border bg-background/75 backdrop-blur-xl">
                <div className="px-gutter mx-auto flex h-[var(--header-h)] max-w-[1240px] items-center gap-4">
                    <button type="button" onClick={onOpenMenu} aria-label={t("header.openMenu")} className={cn(iconButton, "lg:hidden")}>
                        <Menu/>
                    </button>

                    <Link to={ROUTES.HOME} aria-label={t("nav.home")} className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/60">
                        <Logo className="max-sm:[&>span:nth-child(n+3)]:hidden"/>
                    </Link>

                    <nav aria-label={t("nav.books")} className="ml-6 hidden flex-1 items-center gap-9 font-serif text-[18px] lg:flex">
                        {HEADER_LINKS.map((link) => {
                            const isActive = pathname === link.to || pathname.startsWith(`${link.to}/`);
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onPointerEnter={() => preloadRoute(link.to)}
                                    aria-current={isActive ? "page" : undefined}
                                    className={cn("link-underline outline-none transition-colors focus-visible:text-foreground", isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground")}
                                >
                                    {t(link.labelKey)}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="ml-auto flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onOpenSearch}
                            className="hidden h-10 cursor-pointer items-center gap-2.5 rounded-full border border-border pl-4 pr-2 text-sm text-muted-foreground outline-none transition-colors hover:border-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 md:flex"
                        >
                            <Search className="size-4 stroke-[1.5]"/>
                            <span className="pr-6">{t("header.search")}</span>
                            <Kbd className="rounded-full">{MOD_KEY} K</Kbd>
                        </button>
                        <button type="button" onClick={onOpenSearch} aria-label={t("header.search")} className={cn(iconButton, "md:hidden")}>
                            <Search/>
                        </button>
                        <LanguageSwitcher className="hidden h-10 sm:inline-flex"/>
                        <ThemeToggle className="hidden sm:flex"/>
                        <Link
                            to={accountTo}
                            onPointerEnter={() => preloadRoute(accountTo)}
                            aria-label={t(user ? "header.account" : "header.signIn")}
                            className={cn(iconButton, "max-[420px]:hidden", user && "border-accent/60 text-accent-bright")}
                        >
                            <UserRound/>
                            {user && <span aria-hidden className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-background bg-accent"/>}
                        </Link>
                        <Link to={ROUTES.FAVORITES} aria-label={t("header.favorites")} className={cn(iconButton, "max-[380px]:hidden")}>
                            <Heart/>
                            <Count value={favoriteIds.length}/>
                        </Link>
                        <button
                            type="button"
                            onClick={() => cartActions.setDrawerOpen(true)}
                            aria-label={t("header.cart")}
                            className={iconButton}
                            {...{[CART_TARGET_ATTRIBUTE]: ""}}
                        >
                            <ShoppingBag/>
                            <Count value={count}/>
                        </button>
                    </div>
                </div>
            </header>
        </>
    );
};
