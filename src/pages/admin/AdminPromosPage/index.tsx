import {useState} from "react";
import {useForm} from "react-hook-form";
import {Copy, Plus, TicketPercent, Trash2} from "lucide-react";
import {useTranslation} from "react-i18next";
import type {PromoCode} from "@/api/promos.api";
import {FormInput} from "@/components/form/FormInput";
import {Badge, type BadgeTone} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {formatDate} from "@/helpers/format";
import {useCreatePromoCode, useDeletePromoCode, useGetPromoCodes, useSetPromoActive} from "@/hooks/admin";
import {useLanguage} from "@/hooks/useLanguage";
import {copyText} from "@/lib/clipboard";
import {ConfirmDialog} from "@/widgets/ConfirmDialog";
import {EmptyState} from "@/widgets/EmptyState";
import {PageTitle} from "@/widgets/PageTitle";
import {QueryErrorState} from "@/widgets/QueryErrorState";

type PromoForm = {code: string; percent: string; expiresAt: string; usageLimit: string};

const EMPTY_FORM: PromoForm = {code: "", percent: "10", expiresAt: "", usageLimit: ""};

type PromoState = "active" | "paused" | "expired" | "usedUp";

const STATE_TONE: Record<PromoState, BadgeTone> = {active: "success", paused: "neutral", expired: "danger", usedUp: "outline"};

/** Paused is the admin's choice; expired and used up follow from the dates and counts, as check_promo sees them. */
const promoState = (promo: PromoCode): PromoState => {
    if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) return "expired";
    if (promo.usageLimit !== null && promo.usedCount >= promo.usageLimit) return "usedUp";
    return promo.active ? "active" : "paused";
};

const CreatePromo = () => {
    const {t} = useTranslation("admin");
    const create = useCreatePromoCode();
    const {register, handleSubmit, reset, formState: {errors}} = useForm<PromoForm>({mode: "onTouched", defaultValues: EMPTY_FORM});

    const submit = handleSubmit((form) => {
        create.mutate(
            {
                code: form.code,
                percent: Number(form.percent),
                // The code works through the whole chosen day.
                expiresAt: form.expiresAt ? new Date(`${form.expiresAt}T23:59:59`).toISOString() : null,
                usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
            },
            {onSuccess: () => reset(EMPTY_FORM)},
        );
    });

    return (
        <form onSubmit={submit} noValidate className="mt-8 rounded-xl border border-border bg-surface p-5">
            <p className="flex items-center gap-2 font-serif text-xl"><TicketPercent className="size-5 text-accent"/>{t("promos.new")}</p>
            <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <FormInput
                    label={t("promos.fields.code")}
                    required
                    autoComplete="off"
                    placeholder="AUTUMN-15"
                    className="uppercase placeholder:normal-case"
                    hint={t("promos.codeHint")}
                    error={errors.code?.message}
                    {...register("code", {
                        required: t("form.required"),
                        validate: (value) => /^[A-Z0-9-]{3,24}$/.test(value.trim().toUpperCase()) || t("promos.codeInvalid"),
                    })}
                />
                <FormInput
                    label={t("promos.fields.percent")}
                    required
                    inputMode="numeric"
                    error={errors.percent?.message}
                    {...register("percent", {
                        required: t("form.required"),
                        validate: (value) => (Number.isInteger(Number(value)) && Number(value) >= 1 && Number(value) <= 90) || t("promos.percentInvalid"),
                    })}
                />
                <FormInput label={t("promos.fields.expires")} type="date" hint={t("promos.optional")} {...register("expiresAt")}/>
                <FormInput
                    label={t("promos.fields.limit")}
                    inputMode="numeric"
                    hint={t("promos.optional")}
                    error={errors.usageLimit?.message}
                    {...register("usageLimit", {validate: (value) => !value || (Number.isInteger(Number(value)) && Number(value) > 0) || t("form.positiveInteger")})}
                />
            </div>
            <Button type="submit" variant="accent" className="mt-5 rounded-full px-6" loading={create.isPending}><Plus/>{t("promos.create")}</Button>
        </form>
    );
};

/** Discount codes for the checkout: create one, pause or resume it, see how often it was used, delete it. */
export const AdminPromosPage = () => {
    const {t} = useTranslation("admin");
    const {language} = useLanguage();
    const {items: promos, isLoading, isError, refetch} = useGetPromoCodes();
    const toggle = useSetPromoActive();
    const remove = useDeletePromoCode();
    const [deleting, setDeleting] = useState<PromoCode | null>(null);

    return (
        <section>
            <PageTitle title={t("promos.title")} description={t("promos.subtitle")}/>
            <CreatePromo/>

            <div className="mt-6 overflow-hidden rounded-xl border border-border bg-surface">
                {isLoading ? <div className="space-y-2 p-4">{[0, 1, 2].map((key) => <Skeleton key={key} className="h-12"/>)}</div>
                    : isError ? <div className="p-4"><QueryErrorState onRetry={() => void refetch()}/></div>
                    : promos.length === 0 ? <EmptyState className="m-4" title={t("promos.empty")}/>
                    : (
                        <ul className="divide-y divide-border">
                            {promos.map((promo) => {
                                const state = promoState(promo);
                                return (
                                    <li key={promo.code} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5">
                                        <button type="button" onClick={() => void copyText(promo.code, "admin:promos.copied")} title={t("promos.copy")} className="group flex cursor-pointer items-center gap-2 font-mono text-[15px] tracking-wide hover:text-accent-bright">
                                            {promo.code}<Copy className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"/>
                                        </button>
                                        <span className="tabular font-serif text-lg text-accent-bright">−{promo.percent}%</span>
                                        <Badge tone={STATE_TONE[state]}>{t(`promos.state.${state}`)}</Badge>
                                        <span className="min-w-0 flex-1 text-xs text-muted-foreground">
                                            {t("promos.used", {count: promo.usedCount})}{promo.usageLimit !== null && ` / ${promo.usageLimit}`}
                                            {promo.expiresAt && ` · ${t("promos.until", {date: formatDate(promo.expiresAt, language)})}`}
                                        </span>
                                        <span className="flex gap-1">
                                            {(state === "active" || state === "paused") && (
                                                <Button variant="ghost" size="sm" loading={toggle.isPending && toggle.variables?.code === promo.code} onClick={() => toggle.mutate({code: promo.code, active: !promo.active})}>
                                                    {promo.active ? t("promos.pause") : t("promos.resume")}
                                                </Button>
                                            )}
                                            <Button variant="destructive-ghost" size="icon-sm" aria-label={t("promos.delete")} onClick={() => setDeleting(promo)}><Trash2/></Button>
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
            </div>

            <ConfirmDialog
                open={deleting !== null}
                onOpenChange={(open) => { if (!open) setDeleting(null); }}
                title={t("promos.deleteTitle", {code: deleting?.code})}
                description={t("promos.deleteText")}
                confirmLabel={t("promos.delete")}
                isPending={remove.isPending}
                onConfirm={() => deleting && remove.mutate(deleting.code, {onSettled: () => setDeleting(null)})}
            />
        </section>
    );
};
