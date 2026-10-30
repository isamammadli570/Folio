import {useMemo} from "react";
import {Link} from "react-router";
import {useTranslation} from "react-i18next";
import {buildRoute} from "@/constants/routes";
import {useGetBooks} from "@/hooks/books";
import {useLanguage} from "@/hooks/useLanguage";
import {useRecentlyViewed} from "@/hooks/useRecentlyViewed";
import {preloadRoute} from "@/router/preload";
import {BookCover} from "@/widgets/BookCover";
import {cn} from "@/lib/utils";

type RecentlyViewedProps = {
    /** Leave this book out (the one on the page). */
    exclude?: string;
    className?: string;
};

/** A low shelf of the books opened lately in this browser; it scrolls sideways and hides when there is nothing on it. */
export const RecentlyViewed = ({exclude, className}: RecentlyViewedProps) => {
    const {t} = useTranslation("catalog");
    const {pick} = useLanguage();
    const recent = useRecentlyViewed();
    const ids = useMemo(() => recent.filter((id) => id !== exclude).slice(0, 8), [recent, exclude]);
    const {items: books} = useGetBooks({ids}, ids.length > 0);

    if (ids.length === 0 || books.length === 0) return null;

    return (
        <section className={cn("min-w-0", className)}>
            <p className="eyebrow">{t("recent.eyebrow")}</p>
            <h2 className="mt-3 font-serif text-[clamp(28px,3.2vw,40px)]">{t("recent.title")}</h2>
            <ul className="no-scrollbar mt-8 flex snap-x gap-5 overflow-x-auto pb-2 max-sm:bleed-x">
                {books.map((book) => (
                    <li key={book.id} className="w-28 shrink-0 snap-start sm:w-32">
                        <Link to={buildRoute.book(book.id)} onPointerEnter={() => preloadRoute(buildRoute.book(book.id))} className="group block outline-none">
                            <span className="block shadow-[0_12px_20px_-10px_rgb(var(--shade)/0.7)] transition-transform duration-300 group-hover:-translate-y-1 group-focus-visible:ring-2 group-focus-visible:ring-ring/60">
                                <BookCover book={book} author={book.author}/>
                            </span>
                            <span className="mt-2.5 block truncate font-serif text-[15px] group-hover:text-accent-bright">{pick(book.title)}</span>
                            <span className="block truncate text-xs text-muted-foreground">{pick(book.author.name)}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
};
