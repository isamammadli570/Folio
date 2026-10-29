import type {CSSProperties} from "react";
import {Link} from "react-router";
import {useTranslation} from "react-i18next";
import {CATEGORY_COLOR, CATEGORY_IDS, CATEGORY_ORNAMENT} from "@/constants/catalog";
import {buildRoute} from "@/constants/routes";
import {useGetCategoryCounts} from "@/hooks/books";
import {OrnamentIcon} from "@/widgets/BookCover/ornaments";
import {Reveal} from "@/widgets/Reveal";

/** Four tiles in a ruled grid, one per section; a cloth-coloured bar draws in under the one you point at. */
export const CategoryTiles = () => {
    const {t} = useTranslation(["home", "common"]);
    const {data: counts} = useGetCategoryCounts();

    return (
        <section className="px-gutter mx-auto max-w-[1240px] pt-24">
            <Reveal>
                <p className="eyebrow">{t("categories.eyebrow")}</p>
                <h2 className="mt-3 font-serif text-[clamp(36px,4.4vw,56px)] leading-[1.05] [text-wrap:balance]">{t("categories.title")}</h2>
            </Reveal>
            <Reveal variant="stagger" className="mt-10 grid grid-cols-2 gap-px border border-border bg-border lg:grid-cols-4">
                {CATEGORY_IDS.map((id, index) => (
                    <Link
                        key={id}
                        to={buildRoute.catalog({category: id})}
                        style={{"--cloth": CATEGORY_COLOR[id], "--i": index} as CSSProperties}
                        className="group relative overflow-hidden bg-background px-6 pb-7 pt-8 outline-none transition-colors duration-500 hover:bg-surface focus-visible:bg-surface"
                    >
                        <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-[var(--cloth)] brightness-150 transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-x-100 group-focus-visible:scale-x-100"/>
                        <OrnamentIcon name={CATEGORY_ORNAMENT[id]} className="size-10 text-accent transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"/>
                        <span className="mb-1 mt-6 block font-serif text-[28px] leading-tight">{t(`common:categories.${id}`)}</span>
                        <span className="tabular text-xs tracking-wide text-muted-foreground">{counts ? t("common:bookCount", {count: counts[id]}) : " "}</span>
                    </Link>
                ))}
            </Reveal>
        </section>
    );
};
