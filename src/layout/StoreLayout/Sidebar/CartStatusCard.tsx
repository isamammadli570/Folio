import {ArrowRight} from "lucide-react";
import {useTranslation} from "react-i18next";
import {useCartSummary} from "@/hooks/useCartSummary";
import {cartActions} from "@/hooks/useCart";
import {formatPrice} from "@/helpers/format";
import {useLanguage} from "@/hooks/useLanguage";
import {cn} from "@/lib/utils";

type CartStatusCardProps = {
    onOpen: () => void;
};

/** The status card at the foot of the sidebar: how many books are in the cart and what they cost. Opens the cart. */
export const CartStatusCard = ({onOpen}: CartStatusCardProps) => {
    const {t} = useTranslation();
    const {language} = useLanguage();
    const {count, totals} = useCartSummary();
    const hasItems = count > 0;

    return (
        <div className="px-4 pb-4">
            <button
                type="button"
                onClick={() => {
                    onOpen();
                    cartActions.setDrawerOpen(true);
                }}
                className="group flex w-full cursor-pointer items-center gap-3 rounded-xl border border-brand/30 bg-brand-soft/70 px-4 py-3.5 text-left outline-none transition-colors hover:border-brand/60 focus-visible:ring-2 focus-visible:ring-brand/40"
            >
                <span className={cn("relative size-2.5 shrink-0 rounded-full", hasItems ? "bg-brand" : "bg-sidebar-muted/50")}>
                    {hasItems && <span className="absolute inset-0 animate-ping rounded-full bg-brand/60 [animation-duration:2s]"/>}
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] text-brand-ink">{hasItems ? t("sidebar.cartItems", {count}) : t("sidebar.cartEmpty")}</span>
                    {hasItems && <span className="tabular block font-serif text-lg leading-tight text-brand">{formatPrice(totals.total, language)}</span>}
                </span>
                <ArrowRight className="size-4 text-brand-ink transition-transform duration-300 group-hover:translate-x-1"/>
            </button>
        </div>
    );
};
