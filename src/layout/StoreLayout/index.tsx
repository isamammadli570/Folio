import {useState} from "react";
import {Outlet, ScrollRestoration, useLocation} from "react-router";
import {useTranslation} from "react-i18next";
import {Header} from "@/layout/StoreLayout/Header";
import {Footer} from "@/layout/StoreLayout/Footer";
import {CartDrawer} from "@/layout/StoreLayout/CartDrawer";
import {SearchDialog} from "@/layout/StoreLayout/SearchDialog";
import {Sidebar} from "@/layout/StoreLayout/Sidebar";
import {useHotkey} from "@/hooks/useHotkey";
import {useShelfSync} from "@/hooks/useShelfSync";
import {Sheet} from "@/widgets/Sheet";

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

    return (
        <div className="flex min-h-dvh flex-col">
            <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink">{t("skipToContent")}</a>
            <Header onOpenMenu={() => setMenuOpen(true)} onOpenSearch={() => setSearchOpen(true)}/>
            <main id="main" className="flex-1 overflow-x-clip">
                <Outlet/>
            </main>
            <Footer/>

            <Sheet open={menuOpen} onOpenChange={setMenuOpen} title={t("header.openMenu")} side="left">
                <Sidebar onNavigate={() => setMenuOpen(false)} onOpenSearch={() => { setMenuOpen(false); setSearchOpen(true); }}/>
            </Sheet>
            <SearchDialog open={searchOpen} onOpenChange={setSearchOpen}/>
            <CartDrawer/>
            <ScrollRestoration/>
        </div>
    );
};
