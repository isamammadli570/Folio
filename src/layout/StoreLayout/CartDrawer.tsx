import {Link, useNavigate} from "react-router";
import {ArrowRight, Minus, Plus, Trash2, X} from "lucide-react";
import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {buildRoute, ROUTES} from "@/constants/routes";
import {FREE_SHIPPING_FROM} from "@/constants/other";
import {cartActions, useCartDrawer} from "@/hooks/useCart";
import {useCartSummary} from "@/hooks/useCartSummary";
import {useLanguage} from "@/hooks/useLanguage";
import {formatPrice} from "@/helpers/format";
import {BookCover} from "@/widgets/BookCover";
import {EmptyState} from "@/widgets/EmptyState";
import {Sheet} from "@/widgets/Sheet";

/** The cart, sliding in from the right: lines with quantity steppers, progress to free delivery, totals and checkout. */
export const CartDrawer = () => {
    const {t} = useTranslation("cart");
    const {language, pick} = useLanguage();
    const navigate = useNavigate();
    const open = useCartDrawer();
    const {rows, totals, isLoading} = useCartSummary();
    const close = () => cartActions.setDrawerOpen(false);
    const progress = Math.min(100, (totals.subtotal / FREE_SHIPPING_FROM) * 100);

    return (
        <Sheet open={open} onOpenChange={cartActions.setDrawerOpen} title={t("title")} side="right" className="bg-surface">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
                <h2 className="font-display text-[32px] font-medium leading-none">{t("title")}</h2>
                <Button variant="ghost" size="icon" onClick={close} aria-label={t("close")} className="rounded-full"><X/></Button>
            </div>

            {isLoading ? (
                <div className="space-y-5 p-6">{Array.from({length: 2}, (_, index) => <Skeleton key={index} className="h-24"/>)}</div>
            ) : rows.length === 0 ? (
                <div className="flex flex-1 items-center p-6">
                    <EmptyState
                        className="w-full border-none"
                        quote={{text: t("empty.quote"), cite: t("empty.cite")}}
                        title={t("empty.title")}
                        action={<Button variant="outline" onClick={() => { close(); void navigate(ROUTES.CATALOG); }}>{t("empty.action")}</Button>}
                    />
                </div>
            ) : (
                <>
                    <div className="border-b border-border px-6 py-4">
                        <p className="text-[13px] text-muted-foreground">
                            {totals.toFreeShipping > 0 ? t("freeShippingLeft", {amount: formatPrice(totals.toFreeShipping, language)}) : t("freeShippingReached")}
                        </p>
                        <div className="mt-2.5 h-[3px] overflow-hidden rounded-full bg-muted">
                            <div className="h-full rounded-full bg-accent transition-[width] duration-700 ease-[var(--ease-out)]" style={{width: `${progress}%`}}/>
                        </div>
                    </div>

                    <ul className="scroll-thin min-h-0 flex-1 overflow-y-auto px-6">
                        {rows.map(({book, quantity}) => (
                            <li key={book.id} className="animate-fade-up grid grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-4 border-b border-border py-4">
                                <Link to={buildRoute.book(book.id)} onClick={close} className="block shadow-[0_12px_20px_-10px_rgb(var(--shade)/0.7)]">
                                    <BookCover book={book} author={book.author}/>
                                </Link>
                                <div className="min-w-0">
                                    <Link to={buildRoute.book(book.id)} onClick={close} className="line-clamp-2 font-serif text-[17px] font-medium leading-tight hover:text-accent-bright">{pick(book.title)}</Link>
                                    <p className="truncate text-xs text-muted-foreground">{pick(book.author.name)}</p>
                                    <p className="tabular mt-1.5 text-[13px] font-medium text-accent-bright">{formatPrice(book.price * quantity, language)}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex items-center rounded-full border border-border">
                                        <button type="button" aria-label={t("decrease")} onClick={() => (quantity > 1 ? cartActions.setQuantity(book.id, quantity - 1) : cartActions.removeWithUndo(book.id, pick(book.title)))} className="flex size-8 cursor-pointer items-center justify-center rounded-full hover:text-accent-bright"><Minus className="size-3.5"/></button>
                                        <span className="tabular min-w-5 text-center text-[13px]">{quantity}</span>
                                        <button type="button" aria-label={t("increase")} disabled={quantity >= book.stock} onClick={() => cartActions.setQuantity(book.id, quantity + 1)} className="flex size-8 cursor-pointer items-center justify-center rounded-full hover:text-accent-bright disabled:cursor-default disabled:opacity-35"><Plus className="size-3.5"/></button>
                                    </div>
                                    <button type="button" onClick={() => cartActions.removeWithUndo(book.id, pick(book.title))} aria-label={t("remove")} className="cursor-pointer p-1 text-faint-foreground transition-colors hover:text-danger"><Trash2 className="size-3.5"/></button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="space-y-3 border-t border-border px-6 pb-6 pt-5 text-sm">
                        <div className="tabular flex justify-between text-muted-foreground"><span>{t("subtotal")}</span><span>{formatPrice(totals.subtotal, language)}</span></div>
                        <div className="tabular flex justify-between text-muted-foreground"><span>{t("shipping")}</span><span>{totals.shipping ? formatPrice(totals.shipping, language) : t("free")}</span></div>
                        <div className="tabular flex items-baseline justify-between pt-1 font-serif text-2xl"><span>{t("total")}</span><span>{formatPrice(totals.total, language)}</span></div>
                        <Button variant="accent" size="lg" className="mt-2 w-full" onClick={() => { close(); void navigate(ROUTES.CHECKOUT); }}>
                            {t("checkoutAction")}
                            <ArrowRight/>
                        </Button>
                    </div>
                </>
            )}
        </Sheet>
    );
};
