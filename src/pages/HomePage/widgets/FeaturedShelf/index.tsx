import {useLayoutEffect, useRef, useState} from "react";
import {Link} from "react-router";
import {ArrowRight} from "lucide-react";
import {useTranslation} from "react-i18next";
import {CATEGORY_IDS, type CategoryId} from "@/constants/catalog";
import {buildRoute} from "@/constants/routes";
import {useGetBooks} from "@/hooks/books";
import {BookGrid, BookGridSkeleton} from "@/widgets/BookGrid";
import {QueryErrorState} from "@/widgets/QueryErrorState";
import {Reveal} from "@/widgets/Reveal";
import {cn} from "@/lib/utils";

type Tab = CategoryId | "all";
const TABS: Tab[] = ["all", ...CATEGORY_IDS];

/** Eight recommended books with section tabs; a gold underline slides to the chosen tab and the shelf restocks. */
export const FeaturedShelf = () => {
    const {t} = useTranslation(["home", "common"]);
    const [tab, setTab] = useState<Tab>("all");
    const tabsRef = useRef<HTMLDivElement>(null);
    const [underline, setUnderline] = useState({left: 0, width: 0});
    const {items, isLoading, isError, refetch, isPlaceholderData} = useGetBooks({category: tab === "all" ? undefined : tab, sort: "featured", limit: 8});

    useLayoutEffect(() => {
        const measure = () => {
            const active = tabsRef.current?.querySelector<HTMLElement>("[aria-pressed='true']");
            if (active) setUnderline({left: active.offsetLeft, width: active.offsetWidth});
        };
        measure();
        void document.fonts?.ready.then(measure);
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, [tab]);

    return (
        <section className="px-gutter mx-auto max-w-[1240px] pb-10 pt-24">
            <Reveal className="mb-11 flex flex-wrap items-end justify-between gap-6">
                <div>
                    <p className="eyebrow">{t("shelf.eyebrow")}</p>
                    <h2 className="mt-3 font-serif text-[clamp(36px,4.4vw,56px)] leading-[1.05]">{t("shelf.title")}</h2>
                </div>
                <div ref={tabsRef} role="group" aria-label={t("common:nav.categories")} className="relative flex flex-wrap gap-x-6 gap-y-2 border-b border-border pb-2.5">
                    {TABS.map((id) => (
                        <button
                            key={id}
                            type="button"
                            aria-pressed={tab === id}
                            onClick={() => setTab(id)}
                            className={cn("cursor-pointer font-serif text-[17px] outline-none transition-colors focus-visible:text-foreground", tab === id ? "text-foreground" : "text-muted-foreground hover:text-foreground")}
                        >
                            {id === "all" ? t("shelf.all") : t(`common:categories.${id}`)}
                        </button>
                    ))}
                    <span aria-hidden className="absolute -bottom-px h-px bg-accent transition-[left,width] duration-500 ease-[var(--ease-spring)]" style={underline}/>
                </div>
            </Reveal>

            {isError ? <QueryErrorState onRetry={() => void refetch()}/> : isLoading ? <BookGridSkeleton/> : (
                <BookGrid key={tab} books={items} className={cn("transition-opacity duration-300", isPlaceholderData && "opacity-40")}/>
            )}

            <div className="mt-14 flex justify-center">
                <Link to={buildRoute.catalog({category: tab === "all" ? undefined : tab})} className="group inline-flex items-center gap-3 border border-border-strong px-7 py-3.5 text-sm font-medium outline-none transition-colors hover:border-accent hover:text-accent-bright focus-visible:ring-2 focus-visible:ring-ring/60">
                    {t("common:actions.viewAll")}
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1"/>
                </Link>
            </div>
        </section>
    );
};
