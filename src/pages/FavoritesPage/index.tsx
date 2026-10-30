import {useMemo, type CSSProperties, type ReactNode} from "react";
import {Link} from "react-router";
import {Heart, MonitorSmartphone, ShoppingBag} from "lucide-react";
import {useTranslation} from "react-i18next";
import {toast} from "sonner";
import type {BookWithAuthor} from "@/api/types";
import {Button} from "@/components/ui/button";
import {CATEGORY_COLOR, CATEGORY_IDS} from "@/constants/catalog";
import {ROUTES} from "@/constants/routes";
import {useGetBooks} from "@/hooks/books";
import {cartActions} from "@/hooks/useCart";
import {useFavorites} from "@/hooks/useFavorites";
import {useLanguage} from "@/hooks/useLanguage";
import {formatPrice, formatYear} from "@/helpers/format";
import {BookShelf} from "@/pages/FavoritesPage/widgets/BookShelf";
import {BookGrid, BookGridSkeleton} from "@/widgets/BookGrid";
import {Page} from "@/widgets/Page";
import {PageTitle} from "@/widgets/PageTitle";
import {Reveal} from "@/widgets/Reveal";
import {SignInNudge} from "@/widgets/SignInNudge";

type StatProps = {
    label: string;
    index: number;
    children: ReactNode;
};

const Stat = ({label, index, children}: StatProps) => (
    <div className="border-l border-border pl-5" style={{"--i": index} as CSSProperties}>
        <p className="text-[10.5px] font-medium uppercase tracking-[0.22em] text-faint-foreground">{label}</p>
        <div className="tabular mt-2 font-display text-[clamp(28px,3vw,38px)] font-medium leading-none">{children}</div>
    </div>
);

/** An empty ledge with the ghosts of the books that could stand on it, and a heart that keeps beating. */
const EmptyShelf = () => {
    const {t} = useTranslation("cart");

    return (
        <div className="animate-fade-up flex flex-col items-center text-center">
            <div aria-hidden className="relative w-full max-w-md">
                <div className="flex items-end justify-center gap-2 px-6">
                    {[210, 240, 190, 255, 220, 200, 245].map((height, index) => (
                        <span key={index} className="w-8 animate-pulse rounded-t-[3px] border border-dashed border-border-strong" style={{height: height * 0.6, animationDelay: `${index * 160}ms`}}/>
                    ))}
                </div>
                <div className="h-3 rounded-sm bg-gradient-to-b from-[#3a352b] to-[#1a1814]"/>
                <Heart className="absolute -top-6 left-1/2 size-8 -translate-x-1/2 animate-bounce fill-accent/20 stroke-[1.3] text-accent [animation-duration:2.4s]"/>
            </div>
            <p className="mt-10 font-serif text-2xl">{t("favorites.empty")}</p>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">{t("favorites.emptyDescription")}</p>
            <Button asChild variant="outline" size="lg" className="mt-8 rounded-full"><Link to={ROUTES.CATALOG}>{t("favorites.action")}</Link></Button>
        </div>
    );
};

const yearSpan = (books: BookWithAuthor[]): [number, number] =>
    books.reduce<[number, number]>(([from, to], book) => [Math.min(from, book.year), Math.max(to, book.year)], [Infinity, -Infinity]);

/**
 * The visitor's own shelf. Figures first (how many books, what they are worth, how many centuries they span, which
 * sections), then the books standing as spines on a ledge, then the full cards. Kept in the browser until accounts
 * arrive with Supabase.
 */
export const FavoritesPage = () => {
    const {t} = useTranslation(["cart", "common"]);
    const {language} = useLanguage();
    const {ids} = useFavorites();
    const {items, isLoading} = useGetBooks({ids}, ids.length > 0);

    const stats = useMemo(() => {
        const value = items.reduce((sum, book) => sum + Math.round(book.price * 100), 0) / 100;
        const bySection = CATEGORY_IDS.map((id) => ({id, count: items.filter((book) => book.category === id).length})).filter((entry) => entry.count > 0);
        return {value, bySection, span: items.length > 0 ? yearSpan(items) : null};
    }, [items]);

    const addAll = () => {
        const available = items.filter((book) => book.stock > 0);
        available.forEach((book) => cartActions.add(book.id, book.stock));
        toast(t("favorites.addedAll", {count: available.length}), {action: {label: t("common:actions.openCart"), onClick: () => cartActions.setDrawerOpen(true)}});
    };

    if (ids.length === 0) {
        return (
            <Page>
                <PageTitle eyebrow={t("favorites.eyebrow")} title={t("favorites.title")}/>
                <div className="mt-20"><EmptyShelf/></div>
            </Page>
        );
    }

    return (
        <Page>
            <PageTitle
                eyebrow={t("favorites.eyebrow")}
                title={t("favorites.title")}
                actions={items.length > 0 && (
                    <Button variant="accent" size="lg" className="rounded-full" onClick={addAll}>
                        <ShoppingBag className="stroke-[1.6]"/>
                        {t("favorites.addAll")}
                    </Button>
                )}
            />

            <SignInNudge className="mt-8" icon={<MonitorSmartphone/>} title={t("common:nudge.shelfTitle")} text={t("common:nudge.shelfText")}/>

            {isLoading ? <BookGridSkeleton className="mt-14" count={Math.min(ids.length, 8)}/> : (
                <>
                    <Reveal variant="stagger" className="mt-12 grid grid-cols-2 gap-y-8 lg:grid-cols-4">
                        <Stat label={t("favorites.statBooks")} index={0}>{items.length}</Stat>
                        <Stat label={t("favorites.statValue")} index={1}><span className="text-accent-bright">{formatPrice(stats.value, language)}</span></Stat>
                        <Stat label={t("favorites.statSpan")} index={2}>
                            {stats.span && <span className="text-[0.7em]">{formatYear(stats.span[0], t)} — {formatYear(stats.span[1], t)}</span>}
                        </Stat>
                        <Stat label={t("favorites.statSections")} index={3}>
                            <span className="flex h-3 w-full max-w-[220px] overflow-hidden rounded-full bg-muted">
                                {stats.bySection.map((entry) => (
                                    <span key={entry.id} title={`${t(`common:categories.${entry.id}`)} · ${entry.count}`} className="h-full brightness-[1.8] transition-[flex-grow] duration-700" style={{flexGrow: entry.count, background: CATEGORY_COLOR[entry.id]}}/>
                                ))}
                            </span>
                            <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-sans text-[11px] text-muted-foreground">
                                {stats.bySection.map((entry) => <span key={entry.id}>{t(`common:categories.${entry.id}`)} {entry.count}</span>)}
                            </span>
                        </Stat>
                    </Reveal>

                    <Reveal as="section" className="mt-16">
                        <p className="eyebrow mb-2">{t("favorites.shelf")}</p>
                        <BookShelf books={items}/>
                    </Reveal>

                    <Reveal className="mt-24">
                        <p className="eyebrow">{t("favorites.grid")}</p>
                        <BookGrid books={items} className="mt-10"/>
                    </Reveal>
                </>
            )}
        </Page>
    );
};
