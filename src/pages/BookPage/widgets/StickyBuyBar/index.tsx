import {useEffect, useState, type RefObject} from "react";
import {ShoppingBag} from "lucide-react";
import {useTranslation} from "react-i18next";
import type {BookWithAuthor} from "@/api/types";
import {Button} from "@/components/ui/button";
import {useLanguage} from "@/hooks/useLanguage";
import {BookCover} from "@/widgets/BookCover";
import {Price} from "@/widgets/Price";
import {cn} from "@/lib/utils";

type StickyBuyBarProps = {
    book: BookWithAuthor;
    /** The page's own buy row; the bar shows only once that row has scrolled up out of sight. */
    anchorRef: RefObject<HTMLElement | null>;
    onAdd: (cover: HTMLElement | null) => void;
};

/** A slim bar that slides up from the bottom while the main "Add to cart" row is above the screen. */
export const StickyBuyBar = ({book, anchorRef, onAdd}: StickyBuyBarProps) => {
    const {t} = useTranslation();
    const {pick} = useLanguage();
    const [isShown, setIsShown] = useState(false);

    useEffect(() => {
        const anchor = anchorRef.current;
        if (!anchor || !("IntersectionObserver" in window)) return;
        const observer = new IntersectionObserver(([entry]) => setIsShown(!entry.isIntersecting && entry.boundingClientRect.top < 0));
        observer.observe(anchor);
        return () => observer.disconnect();
    }, [anchorRef]);

    const isSoldOut = book.stock <= 0;

    return (
        <div
            aria-hidden={!isShown}
            inert={!isShown}
            className={cn(
                "fixed inset-x-0 bottom-0 z-30 border-t border-border-strong bg-background/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl transition-[translate,opacity] duration-500 ease-[var(--ease-out)]",
                isShown ? "translate-y-0 opacity-100" : "translate-y-full opacity-0",
            )}
        >
            <div className="px-gutter mx-auto flex max-w-[1240px] items-center gap-4 py-3">
                <div className="sticky-cover w-9 shrink-0"><BookCover book={book} author={book.author}/></div>
                <div className="min-w-0 flex-1">
                    <p className="truncate font-serif text-[17px] leading-tight">{pick(book.title)}</p>
                    <p className="truncate text-xs text-muted-foreground">{pick(book.author.name)}</p>
                </div>
                <Price book={book} className="max-sm:hidden"/>
                <Button
                    variant="accent"
                    disabled={isSoldOut}
                    className="rounded-full px-5"
                    onClick={(event) => onAdd(event.currentTarget.closest("div")?.parentElement?.querySelector<HTMLElement>(".sticky-cover .book-cover") ?? null)}
                >
                    <ShoppingBag className="stroke-[1.6]"/>
                    <span className="max-sm:sr-only">{isSoldOut ? t("actions.outOfStock") : t("actions.addToCart")}</span>
                </Button>
            </div>
        </div>
    );
};
