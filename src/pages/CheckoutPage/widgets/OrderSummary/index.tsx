import {ChevronDown} from "lucide-react";
import {useTranslation} from "react-i18next";
import type {BookWithAuthor} from "@/api/types";
import type {CartTotals} from "@/helpers/cart";
import {formatPrice} from "@/helpers/format";
import {useLanguage} from "@/hooks/useLanguage";
import {BookCover} from "@/widgets/BookCover";
import {cn} from "@/lib/utils";

type OrderSummaryProps = {
    rows: {book: BookWithAuthor; quantity: number}[];
    totals: CartTotals;
    className?: string;
};

/** The order on the side of checkout: covers with quantities, then subtotal, delivery and total. */
export const OrderSummary = ({rows, totals, className}: OrderSummaryProps) => {
    const {t} = useTranslation("cart");
    const {language, pick} = useLanguage();

    return (
        <aside className={cn("border border-border bg-surface p-6 lg:sticky lg:top-[calc(var(--header-h)+2rem)]", className)}>
            <h2 className="font-display text-[28px] font-medium">{t("checkout.summary")}</h2>
            <ul className="mt-5 divide-y divide-border border-y border-border">
                {rows.map(({book, quantity}) => (
                    <li key={book.id} className="grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-4 py-3.5">
                        <div className="relative">
                            <BookCover book={book} author={book.author}/>
                            <span className="tabular absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-accent text-[10.5px] font-semibold text-accent-ink">{quantity}</span>
                        </div>
                        <div className="min-w-0">
                            <p className="truncate font-serif text-[16px]">{pick(book.title)}</p>
                            <p className="truncate text-xs text-muted-foreground">{pick(book.author.name)}</p>
                        </div>
                        <span className="tabular text-sm">{formatPrice(book.price * quantity, language)}</span>
                    </li>
                ))}
            </ul>
            <dl className="tabular mt-5 space-y-2.5 text-sm">
                <div className="flex justify-between text-muted-foreground"><dt>{t("subtotal")}</dt><dd>{formatPrice(totals.subtotal, language)}</dd></div>
                <div className="flex justify-between text-muted-foreground"><dt>{t("shipping")}</dt><dd>{totals.shipping ? formatPrice(totals.shipping, language) : t("free")}</dd></div>
                <div className="flex items-baseline justify-between border-t border-border pt-3 font-serif text-2xl"><dt>{t("total")}</dt><dd className="text-accent-bright">{formatPrice(totals.total, language)}</dd></div>
            </dl>
        </aside>
    );
};

/**
 * The order folded into one line for phones, above the form: how many books and the total, so the price is never
 * three screens away. Tapping it opens the same list as the side summary.
 */
export const OrderSummaryBar = ({rows, totals, className}: OrderSummaryProps) => {
    const {t} = useTranslation("cart");
    const {language, pick} = useLanguage();
    const count = rows.reduce((sum, row) => sum + row.quantity, 0);

    return (
        <details className={cn("group border border-border bg-surface", className)}>
            <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3.5 outline-none focus-visible:ring-2 focus-visible:ring-ring/40 [&::-webkit-details-marker]:hidden">
                <span className="flex -space-x-3">
                    {rows.slice(0, 3).map(({book}) => <span key={book.id} className="w-7 shadow-[0_4px_10px_-4px_rgb(var(--shade)/0.7)]"><BookCover book={book} author={book.author}/></span>)}
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block font-serif text-[17px] leading-tight">{t("checkout.summary")}</span>
                    <span className="block text-xs text-muted-foreground">{t("checkout.summaryCount", {count})}</span>
                </span>
                <span className="tabular font-serif text-xl text-accent-bright">{formatPrice(totals.total, language)}</span>
                <ChevronDown className="size-4 text-muted-foreground transition-transform duration-300 group-open:rotate-180"/>
            </summary>
            <div className="border-t border-border px-4 pb-4">
                <ul className="divide-y divide-border">
                    {rows.map(({book, quantity}) => (
                        <li key={book.id} className="flex items-baseline justify-between gap-3 py-2.5">
                            <span className="min-w-0 truncate font-serif text-[15px]">{pick(book.title)} <span className="text-xs text-muted-foreground">× {quantity}</span></span>
                            <span className="tabular text-sm">{formatPrice(book.price * quantity, language)}</span>
                        </li>
                    ))}
                </ul>
                <dl className="tabular space-y-1.5 border-t border-border pt-3 text-sm text-muted-foreground">
                    <div className="flex justify-between"><dt>{t("subtotal")}</dt><dd>{formatPrice(totals.subtotal, language)}</dd></div>
                    <div className="flex justify-between"><dt>{t("shipping")}</dt><dd>{totals.shipping ? formatPrice(totals.shipping, language) : t("free")}</dd></div>
                </dl>
            </div>
        </details>
    );
};
