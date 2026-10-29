import {useTranslation} from "react-i18next";
import type {Book} from "@/api/types";
import {discountPercent} from "@/helpers/catalog";
import {formatPrice} from "@/helpers/format";
import {useLanguage} from "@/hooks/useLanguage";
import {cn} from "@/lib/utils";

type PriceProps = {
    book: Pick<Book, "price" | "oldPrice">;
    size?: "sm" | "lg";
    className?: string;
};

/** The price in gold; on sale, the old price struck through and the saving. */
export const Price = ({book, size = "sm", className}: PriceProps) => {
    const {t} = useTranslation();
    const {language} = useLanguage();
    const percent = discountPercent(book);

    return (
        <span className={cn("tabular inline-flex flex-wrap items-baseline gap-x-2.5 gap-y-1", className)}>
            <span className={cn("font-medium text-accent-bright", size === "lg" ? "font-serif text-[34px] leading-none" : "text-sm")}>{formatPrice(book.price, language)}</span>
            {percent !== null && book.oldPrice !== undefined && (
                <>
                    <span className={cn("text-faint-foreground line-through", size === "lg" ? "text-base" : "text-xs")}>{formatPrice(book.oldPrice, language)}</span>
                    {size === "lg" && <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent-bright">{t("discount", {percent})}</span>}
                </>
            )}
        </span>
    );
};
