import {memo, type CSSProperties} from "react";
import {Link} from "react-router";
import {Plus} from "lucide-react";
import {useTranslation} from "react-i18next";
import type {BookWithAuthor} from "@/api/types";
import {buildRoute} from "@/constants/routes";
import {useAddToCart} from "@/hooks/useAddToCart";
import {useLanguage} from "@/hooks/useLanguage";
import {useTilt} from "@/hooks/useTilt";
import {preloadRoute} from "@/router/preload";
import {BookCover} from "@/widgets/BookCover";
import {FavoriteButton} from "@/widgets/FavoriteButton";
import {Price} from "@/widgets/Price";
import {cn} from "@/lib/utils";

type BookCardProps = {
    book: BookWithAuthor;
    index?: number;
    className?: string;
};

/**
 * A book on the shelf: the cover leans towards the pointer and lifts, "Add to cart" rises from its foot, the heart sits
 * in the corner. Title, author and price sit under it on one grid so neighbouring cards line up.
 */
export const BookCard = memo(({book, index = 0, className}: BookCardProps) => {
    const {t} = useTranslation();
    const {pick} = useLanguage();
    const addToCart = useAddToCart();
    const {ref: tiltRef, onPointerMove, onPointerLeave} = useTilt<HTMLDivElement>();
    const href = buildRoute.book(book.id);
    const isSoldOut = book.stock <= 0;

    return (
        <article className={cn("group/book", className)} style={{"--i": index} as CSSProperties}>
            <div className="relative [perspective:900px]" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
                <Link to={href} onPointerEnter={() => preloadRoute(href)} className="block rounded-[2px_5px_5px_2px] outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-4 focus-visible:ring-offset-background">
                    <div
                        ref={tiltRef}
                        className={cn(
                            "transition-[transform,box-shadow,filter] duration-500 ease-[var(--ease-out)] [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))]",
                            "shadow-[0_18px_30px_-16px_rgb(var(--shade)/0.85)] group-hover/book:shadow-[0_40px_50px_-22px_rgb(var(--shade)/0.9),0_0_40px_-10px_color-mix(in_srgb,var(--accent)_22%,transparent)]",
                            isSoldOut && "grayscale-[0.6]",
                        )}
                    >
                        <BookCover book={book} author={book.author}/>
                    </div>
                </Link>
                {book.tag && (
                    <span className="pointer-events-none absolute -left-1.5 top-3 z-[1] bg-accent max-sm:hidden px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-ink">
                        {t(`tags.${book.tag}`)}
                    </span>
                )}
                <FavoriteButton bookId={book.id} className="absolute right-2.5 top-2.5 z-[1] opacity-100 sm:opacity-0 sm:group-hover/book:opacity-100 sm:focus-visible:opacity-100 sm:aria-pressed:opacity-100"/>
                <button
                    type="button"
                    disabled={isSoldOut}
                    onClick={(event) => addToCart(book, event.currentTarget.parentElement?.querySelector<HTMLElement>(".book-cover"))}
                    className={cn(
                        "absolute inset-x-[9%] bottom-[6%] z-[1] flex cursor-pointer items-center justify-center gap-2 rounded-sm px-3 py-2.5 text-[13px] font-medium shadow-[0_10px_20px_-8px_rgb(var(--shade)/0.6)] outline-none transition-[opacity,transform,background-color] duration-300",
                        "max-sm:inset-x-auto max-sm:bottom-2.5 max-sm:right-2.5 max-sm:size-9 max-sm:rounded-full max-sm:p-0",
                        "bg-primary text-primary-foreground hover:bg-accent-bright focus-visible:ring-2 focus-visible:ring-ring/70",
                        "disabled:cursor-default disabled:bg-surface-raised disabled:text-muted-foreground",
                        "[@media(hover:hover)]:translate-y-2.5 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/book:translate-y-0 [@media(hover:hover)]:group-hover/book:opacity-100 [@media(hover:hover)]:focus-visible:translate-y-0 [@media(hover:hover)]:focus-visible:opacity-100",
                    )}
                >
                    {isSoldOut ? <span className="max-sm:sr-only">{t("actions.outOfStock")}</span> : <><Plus className="size-4 stroke-[1.8]"/><span className="max-sm:sr-only">{t("actions.addToCart")}</span></>}
                </button>
            </div>
            <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-3">
                <Link to={href} className="min-w-0 font-serif text-[19px] leading-snug outline-none hover:text-accent-bright focus-visible:underline">
                    <h3 className="line-clamp-2 font-medium">{pick(book.title)}</h3>
                </Link>
                <Price book={book} className="flex-col items-end gap-0"/>
                <p className="col-span-2 mt-1 truncate text-[13px] text-muted-foreground">
                    {book.tag && <span className="mr-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent sm:hidden">{t(`tags.${book.tag}`)} ·</span>}
                    {pick(book.author.name)}
                </p>
            </div>
        </article>
    );
});
