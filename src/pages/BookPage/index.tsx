import {useEffect, useRef, useState, type CSSProperties} from "react";
import {Link, useParams} from "react-router";
import {ArrowRight, ChevronRight, Minus, Plus, ShoppingBag, Truck} from "lucide-react";
import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {CATEGORY_COLOR} from "@/constants/catalog";
import {buildRoute, ROUTES} from "@/constants/routes";
import {useGetBook, useGetBooks} from "@/hooks/books";
import {useAddToCart} from "@/hooks/useAddToCart";
import {useDocumentTitle} from "@/hooks/useDocumentTitle";
import {useGetRatings} from "@/hooks/reviews";
import {recordView} from "@/hooks/useRecentlyViewed";
import {Reviews} from "@/pages/BookPage/widgets/Reviews";
import {StockAlert} from "@/pages/BookPage/widgets/StockAlert";
import {RecentlyViewed} from "@/widgets/RecentlyViewed";
import {Stars} from "@/widgets/Stars";
import {useLanguage} from "@/hooks/useLanguage";
import {useTilt} from "@/hooks/useTilt";
import {stockLevel} from "@/helpers/catalog";
import {formatLifespan, formatYear, surname} from "@/helpers/format";
import {RouteErrorPage} from "@/router/RouteErrorPage";
import {Book3D} from "@/widgets/Book3D";
import {BookGrid} from "@/widgets/BookGrid";
import {FavoriteButton} from "@/widgets/FavoriteButton";
import {Medallion} from "@/widgets/Medallion";
import {OrnamentDivider} from "@/widgets/OrnamentDivider";
import {Page} from "@/widgets/Page";
import {Price} from "@/widgets/Price";
import {Reveal} from "@/widgets/Reveal";
import {Timeline} from "@/widgets/Timeline";
import {StickyBuyBar} from "@/pages/BookPage/widgets/StickyBuyBar";
import {cn} from "@/lib/utils";

const BookPageSkeleton = () => (
    <Page>
        <Skeleton className="h-3 w-48"/>
        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-12 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <Skeleton className="mx-auto aspect-[2/3] w-full max-w-[420px]"/>
            <div className="space-y-5"><Skeleton className="h-3 w-24"/><Skeleton className="h-16 w-4/5"/><Skeleton className="h-5 w-40"/><Skeleton className="mt-8 h-10 w-36"/><Skeleton className="h-12 w-full max-w-sm"/></div>
        </div>
    </Page>
);

/** One book: a large cover that leans to the pointer, the buying column, the description and the author, then more books. */
export const BookPage = () => {
    const {bookId} = useParams();
    const {t} = useTranslation(["catalog", "common", "authors"]);
    const {language, pick} = useLanguage();
    const {data: book, isLoading, isError} = useGetBook(bookId);
    const {items: byAuthor} = useGetBooks({authorId: book?.authorId}, Boolean(book));
    const {items: sameCategory} = useGetBooks({category: book?.category, sort: "featured"}, Boolean(book));
    const [quantity, setQuantity] = useState(1);
    const addToCart = useAddToCart();
    const {ref: tiltRef, onPointerMove, onPointerLeave} = useTilt<HTMLDivElement>(10, 14);
    const coverRef = useRef<HTMLDivElement>(null);
    const buyRowRef = useRef<HTMLDivElement>(null);
    useDocumentTitle(book ? `${pick(book.title)} · ${pick(book.author.name)}` : undefined);
    const {data: ratings} = useGetRatings();
    const bookKey = book?.id;
    useEffect(() => {
        if (bookKey) recordView(bookKey);
    }, [bookKey]);

    if (isLoading) return <BookPageSkeleton/>;
    if (isError || !book) return <RouteErrorPage/>;

    const title = pick(book.title);
    const authorName = pick(book.author.name);
    const level = stockLevel(book.stock);
    const others = byAuthor.filter((item) => item.id !== book.id).slice(0, 4);
    const related = sameCategory.filter((item) => item.id !== book.id && item.authorId !== book.authorId).slice(0, 4);
    const description = pick(book.description);

    const details: [string, string][] = [
        [t("book.by"), authorName],
        [t("book.year"), formatYear(book.year, t, book.approxYear)],
        [t("book.pages"), t("book.pagesValue", {count: book.pages})],
        [t("book.category"), t(`common:categories.${book.category}`)],
        [t("book.edition"), t("book.editionValue")],
        // About a minute and a half per page, the pace of careful reading of a classic.
        [t("book.readingLabel"), t("book.readingTime", {count: Math.max(1, Math.round((book.pages * 1.6) / 60))})],
    ];
    const addFrom = (cover: HTMLElement | null, count = 1) => addToCart(book, cover?.querySelector<HTMLElement>(".book-cover") ?? cover, count);

    return (
        <Page key={book.id}>
            <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                <Link to={ROUTES.CATALOG} className="hover:text-foreground">{t("book.breadcrumb")}</Link>
                <ChevronRight className="size-3"/>
                <Link to={buildRoute.catalog({category: book.category})} className="hover:text-foreground">{t(`common:categories.${book.category}`)}</Link>
                <ChevronRight className="size-3"/>
                <span aria-current="page" className="truncate text-foreground">{title}</span>
            </nav>

            <div className="mt-6 grid grid-cols-[minmax(0,1fr)] items-start gap-8 md:mt-10 md:gap-12 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
                <div className="relative md:sticky md:top-[calc(var(--header-h)+2rem)]" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
                    <div aria-hidden className="absolute inset-x-[8%] -bottom-6 h-10 rounded-[50%] bg-[rgb(var(--shade)/0.6)] blur-2xl"/>
                    <div aria-hidden className="absolute inset-[-12%] -z-10 rounded-full opacity-50 blur-3xl" style={{background: `radial-gradient(circle, color-mix(in srgb, ${CATEGORY_COLOR[book.category]} 70%, var(--accent)), transparent 65%)`} as CSSProperties}/>
                    {/* No filter on this wrapper: a filter here would flatten the 3D book in some browsers. */}
                    <div ref={tiltRef} className="mx-auto w-[min(250px,64vw)] py-4 md:w-full md:max-w-[380px] md:py-6">
                        <Book3D ref={coverRef} book={book} author={book.author}/>
                    </div>
                    <p className="mt-6 text-center text-[11px] text-faint-foreground max-md:hidden [@media(hover:none)]:hidden">{t("book.rotateHint")}</p>
                </div>

                <div className="min-w-0">
                    <p className="eyebrow">{t(`common:categories.${book.category}`)}{book.tag && ` · ${t(`common:tags.${book.tag}`)}`}</p>
                    <h1 className="mt-4 font-display text-[clamp(44px,6vw,76px)] font-medium leading-[0.98] [text-wrap:balance]">{title}</h1>
                    <Link to={buildRoute.author(book.authorId)} className="link-underline mt-4 inline-block font-serif text-xl text-muted-foreground hover:text-foreground">{authorName}</Link>

                    {ratings?.[book.id] && (
                        <a href="#reviews" className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                            <Stars value={ratings[book.id].average}/>
                            <span className="tabular">{ratings[book.id].average.toFixed(1)}</span>
                            <span>· {t("reviews.count", {count: ratings[book.id].count})}</span>
                        </a>
                    )}

                    <div className="mt-9 flex flex-wrap items-center gap-4">
                        <Price book={book} size="lg"/>
                        <span className={cn("inline-flex items-center gap-2 text-[13px]", level === "out" ? "text-danger" : level === "low" ? "text-accent-bright" : "text-success")}>
                            <span className="size-1.5 rounded-full bg-current"/>
                            {level === "low" ? t("common:stock.low", {count: book.stock}) : t(`common:stock.${level}`)}
                        </span>
                    </div>

                    <div ref={buyRowRef} className="mt-8 flex flex-wrap items-center gap-3">
                        <div className="flex h-12 items-center rounded-full border border-border-strong" role="group" aria-label={t("book.quantity")}>
                            <button type="button" aria-label={t("book.decrease")} disabled={quantity <= 1} onClick={() => setQuantity((value) => value - 1)} className="flex size-12 cursor-pointer items-center justify-center rounded-full hover:text-accent-bright disabled:cursor-default disabled:opacity-30"><Minus className="size-4"/></button>
                            <span className="tabular w-7 text-center">{quantity}</span>
                            <button type="button" aria-label={t("book.increase")} disabled={quantity >= book.stock} onClick={() => setQuantity((value) => value + 1)} className="flex size-12 cursor-pointer items-center justify-center rounded-full hover:text-accent-bright disabled:cursor-default disabled:opacity-30"><Plus className="size-4"/></button>
                        </div>
                        <Button variant="accent" size="lg" disabled={level === "out"} className="min-w-52 flex-1 rounded-full sm:flex-none" onClick={() => { addFrom(coverRef.current, quantity); setQuantity(1); }}>
                            <ShoppingBag className="stroke-[1.6]"/>
                            {level === "out" ? t("common:actions.outOfStock") : t("common:actions.addToCart")}
                        </Button>
                        <FavoriteButton bookId={book.id} variant="outline"/>
                    </div>
                    {level === "out" && <StockAlert key={book.id} bookId={book.id}/>}

                    <p className="mt-6 flex items-center gap-2.5 text-[13px] text-muted-foreground"><Truck className="size-4 stroke-[1.5] text-accent"/>{t("book.freeShipping")} · {t("book.delivery")}</p>

                    <OrnamentDivider className="my-10"/>

                    <h2 className="text-[10.5px] font-medium uppercase tracking-[0.22em] text-accent">{t("book.description")}</h2>
                    <p className="mt-4 max-w-[62ch] font-serif text-[20px] leading-relaxed first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-[68px] first-letter:font-semibold first-letter:leading-[0.8] first-letter:text-accent-bright">{description}</p>

                    <dl className="mt-10 grid max-w-xl grid-cols-[auto_minmax(0,1fr)] gap-x-8 border-t border-border">
                        {details.map(([label, value]) => (
                            <div key={label} className="contents">
                                <dt className="border-b border-border py-3 text-[13px] text-muted-foreground">{label}</dt>
                                <dd className="tabular border-b border-border py-3 text-right font-serif text-[17px]">{value}</dd>
                            </div>
                        ))}
                    </dl>

                    <Timeline
                        className="mt-12"
                        title={t("book.timeline")}
                        life={{born: book.author.born, died: book.author.died, label: `${t("book.timelineLife")} · ${authorName}`}}
                        marks={[{year: book.year, approx: book.approxYear, label: title}]}
                    />

                    <section className="mt-12 grid grid-cols-[72px_minmax(0,1fr)] items-center gap-x-5 gap-y-4 border border-border bg-surface p-5 sm:grid-cols-[112px_minmax(0,1fr)] sm:items-start sm:gap-6 sm:p-6">
                        <Link to={buildRoute.author(book.authorId)} aria-label={authorName} className="sm:row-span-2 sm:self-start">
                            <Medallion letter={surname(authorName)[0]} portrait={book.author.portrait} alt={authorName} className="w-full"/>
                        </Link>
                        <div className="min-w-0">
                            <p className="text-[10.5px] font-medium uppercase tracking-[0.22em] text-accent">{t("book.aboutAuthor")}</p>
                            <h2 className="mt-1.5 font-serif text-2xl">{authorName}</h2>
                            <p className="mt-0.5 text-xs text-muted-foreground">{formatLifespan(book.author.born, book.author.died, t, book.author.approx)} · {pick(book.author.movement)}</p>
                        </div>
                        <div className="col-span-2 min-w-0 sm:col-span-1 sm:col-start-2">
                            <p className="font-serif text-[17px] leading-relaxed text-muted-foreground">{pick(book.author.bio)}</p>
                            {book.author.quote && (
                                <blockquote className="mt-4 border-l border-accent/60 pl-4 font-serif italic">
                                    <span lang={book.author.quote.lang}>“{book.author.quote.text}”</span>
                                    {book.author.quote.lang !== language && <span className="mt-1 block text-[15px] text-muted-foreground">{pick(book.author.quote.translation)}</span>}
                                </blockquote>
                            )}
                            <Link to={buildRoute.author(book.authorId)} className="group mt-5 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-accent hover:text-accent-bright">
                                {t("book.authorPage")}
                                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1"/>
                            </Link>
                        </div>
                    </section>
                </div>
            </div>

            <Reviews bookId={book.id}/>

            {others.length > 0 && (
                <Reveal as="section" className="mt-28">
                    <p className="eyebrow">{authorName}</p>
                    <h2 className="mb-10 mt-3 font-serif text-[clamp(30px,3.6vw,44px)]">{t("book.moreByAuthor")}</h2>
                    <BookGrid books={others}/>
                </Reveal>
            )}
            {related.length > 0 && (
                <Reveal as="section" className="mt-28">
                    <p className="eyebrow">{t(`common:categories.${book.category}`)}</p>
                    <h2 className="mb-10 mt-3 font-serif text-[clamp(30px,3.6vw,44px)]">{t("book.related")}</h2>
                    <BookGrid books={related}/>
                </Reveal>
            )}

            <RecentlyViewed exclude={book.id} className="mt-28"/>

            <StickyBuyBar book={book} anchorRef={buyRowRef} onAdd={(cover) => addFrom(cover)}/>
        </Page>
    );
};
