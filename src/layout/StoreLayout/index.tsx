import {Suspense, useState} from "react";
import {Outlet, ScrollRestoration, useLocation} from "react-router";
import {useTranslation} from "react-i18next";
import {Header} from "@/layout/StoreLayout/Header";
import {AccountMenu, CartDrawer, MenuSheet, SearchDialog} from "@/layout/StoreLayout/overlays";
import {Footer} from "@/layout/StoreLayout/Footer";
import {useHotkey} from "@/hooks/useHotkey";
import {useShelfSync} from "@/hooks/useShelfSync";
import {useCartDrawer} from "@/hooks/useCart";
import {useOpenedOnce, usePreloadWhenIdle} from "@/lib/lazy";

/** The storefront shell: header, the page, footer, and the overlays every page can open (menu, search, cart). */
export const StoreLayout = () => {
    const {t} = useTranslation();
    const {pathname} = useLocation();
    // The menu remembers the page it was opened on, so reaching another page (even by the back button) closes it.
    const [menuPath, setMenuPath] = useState<string | null>(null);
    const menuOpen = menuPath === pathname;
    const setMenuOpen = (open: boolean) => setMenuPath(open ? pathname : null);
    const [searchOpen, setSearchOpen] = useState(false);

    useHotkey("k", () => setSearchOpen(true));
    useShelfSync();
    usePreloadWhenIdle(AccountMenu, SearchDialog, CartDrawer, MenuSheet);
    const cartOpen = useCartDrawer();
    const hasMenu = useOpenedOnce(menuOpen);
    const hasSearch = useOpenedOnce(searchOpen);
    const hasCart = useOpenedOnce(cartOpen);

    return (
        <div className="flex min-h-dvh flex-col">
            <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink">{t("skipToContent")}</a>
            <Header onOpenMenu={() => setMenuOpen(true)} onOpenSearch={() => setSearchOpen(true)}/>
            <main id="main" className="flex-1 overflow-x-clip">
                <Outlet/>
            </main>
            <Footer/>

            <Suspense>
                {hasMenu && <MenuSheet open={menuOpen} onOpenChange={setMenuOpen} onOpenSearch={() => { setMenuOpen(false); setSearchOpen(true); }}/>}
                {hasSearch && <SearchDialog open={searchOpen} onOpenChange={setSearchOpen}/>}
                {hasCart && <CartDrawer/>}
            </Suspense>
            <ScrollRestoration/>
        </div>
    );
};
