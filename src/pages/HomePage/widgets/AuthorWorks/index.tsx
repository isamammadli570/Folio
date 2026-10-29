import {useRef, type CSSProperties} from "react";
import {Link} from "react-router";
import {ArrowRight} from "lucide-react";
import {useTranslation} from "react-i18next";
import type {AuthorSummary} from "@/api/authors.api";
import {Skeleton} from "@/components/ui/skeleton";
import {buildRoute} from "@/constants/routes";
import {useGetBooks} from "@/hooks/books";
import {useAddToCart} from "@/hooks/useAddToCart";
import {useLanguage} from "@/hooks/useLanguage";
import {BookCover} from "@/widgets/BookCover";
import {Price} from "@/widgets/Price";

type AuthorWorksProps = {
    author: AuthorSummary | undefined;
};

/** A strip under the hero with the spotlighted author's books; it changes together with the spotlight. */
export const AuthorWorks = ({author}: AuthorWorksProps) => {
    const {t} = useTranslation(["home", "common"]);
    const {pick} = useLanguage();
    const addToCart = useAddToCart();
    const coversRef = useRef(new Map<string, HTMLElement>());
    const {items: books, isLoading} = useGetBooks({authorId: author?.id, limit: 3}, Boolean(author));

    return (
        <section className="border-y border-border bg-surface">
            <div className="px-gutter mx-auto grid max-w-[1240px] items-center gap-8 py-9 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] lg:gap-10">
                <div>
                    <p className="eyebrow">{t("works.eyebrow")}</p>
                    {author ? <h2 className="mb-3 mt-2 font-serif text-3xl leading-tight">{pick(author.name)}</h2> : <Skeleton className="mb-3 mt-2 h-8 w-40"/>}
                    {author && (
                        <Link to={buildRoute.author(author.id)} className="group inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.14em] text-accent hover:text-accent-bright">
                            {t("works.more")}
                            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"/>
                        </Link>
                    )}
                </div>
                <div className="grid gap-5 sm:grid-cols-3">
                    {isLoading || !author
                        ? Array.from({length: 3}, (_, index) => <Skeleton key={index} className="h-[126px]"/>)
                        : books.map((book, index) => (
                            <div key={book.id} className="animate-fade-up grid grid-cols-[84px_minmax(0,1fr)] items-center gap-4" style={{animationDelay: `${index * 90}ms`} as CSSProperties}>
                                <Link to={buildRoute.book(book.id)} ref={(element) => { if (element) coversRef.current.set(book.id, element); }} className="block shadow-[0_12px_20px_-10px_rgb(var(--shade)/0.7)] transition-transform duration-300 hover:-translate-y-1">
                                    <BookCover book={book} author={book.author}/>
                                </Link>
                                <div className="min-w-0">
                                    <Link to={buildRoute.book(book.id)} className="line-clamp-2 font-serif text-[19px] font-medium leading-tight hover:text-accent-bright">{pick(book.title)}</Link>
                                    <p className="mb-2.5 mt-1 text-[13px] text-muted-foreground">{t(`common:categories.${book.category}`)} · <Price book={book}/></p>
                                    <button
                                        type="button"
                                        disabled={book.stock <= 0}
                                        onClick={() => addToCart(book, coversRef.current.get(book.id)?.querySelector<HTMLElement>(".book-cover"))}
                                        className="cursor-pointer border-b border-accent/30 pb-0.5 text-xs font-medium text-accent transition-colors hover:border-accent disabled:cursor-default disabled:text-muted-foreground"
                                    >
                                        {book.stock > 0 ? t("common:actions.addToCart") : t("common:actions.outOfStock")}
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </section>
    );
};
