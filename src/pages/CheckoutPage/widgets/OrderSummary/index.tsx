import {useTranslation} from "react-i18next";
import type {BookWithAuthor} from "@/api/types";
import type {CartTotals} from "@/helpers/cart";
import {formatPrice} from "@/helpers/format";
import {useLanguage} from "@/hooks/useLanguage";
import {BookCover} from "@/widgets/BookCover";

type OrderSummaryProps = {
    rows: {book: BookWithAuthor; quantity: number}[];
    totals: CartTotals;
};

/** The order on the side of checkout: covers with quantities, then subtotal, delivery and total. */
export const OrderSummary = ({rows, totals}: OrderSummaryProps) => {
    const {t} = useTranslation("cart");
    const {language, pick} = useLanguage();

    return (
        <aside className="border border-border bg-surface p-6 lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
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
