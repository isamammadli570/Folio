import {useEffect, useRef, useState, type ReactNode} from "react";
import {Link} from "react-router";
import {useForm, useWatch, type FieldPath} from "react-hook-form";
import {AlertCircle, ArrowLeft, ArrowRight, Check, Info, PackageCheck, Store, Truck, UserRound} from "lucide-react";
import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {FormInput} from "@/components/form/FormInput";
import {FormTextarea} from "@/components/form/FormTextarea";
import {ROUTES} from "@/constants/routes";
import {AZ_PHONE_PATTERN, EMAIL_PATTERN} from "@/constants/validation";
import {cartActions} from "@/hooks/useCart";
import {useGetAddresses, useGetProfile, usePlaceOrder} from "@/hooks/account";
import {useAuth} from "@/hooks/useAuth";
import {useLanguage} from "@/hooks/useLanguage";
import {splitErrorCode} from "@/helpers/apiError";
import {useCartSummary} from "@/hooks/useCartSummary";
import {OrderSummary} from "@/pages/CheckoutPage/widgets/OrderSummary";
import {EmptyState} from "@/widgets/EmptyState";
import {Page} from "@/widgets/Page";
import {PageTitle} from "@/widgets/PageTitle";
import {cn} from "@/lib/utils";

type CheckoutForm = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    method: "courier" | "pickup";
    city: string;
    address: string;
    note: string;
    payment: "cash" | "card";
};

const STEPS = ["contact", "delivery", "confirm"] as const;

const STEP_FIELDS: FieldPath<CheckoutForm>[][] = [
    ["firstName", "lastName", "email", "phone"],
    ["method", "city", "address", "payment"],
    [],
];

type ChoiceCardProps = {
    checked: boolean;
    icon: ReactNode;
    title: string;
    hint?: string;
    children: ReactNode;
};

const ChoiceCard = ({checked, icon, title, hint, children}: ChoiceCardProps) => (
    <label className={cn("relative flex cursor-pointer items-start gap-3.5 border p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/50", checked ? "border-accent bg-accent-soft" : "border-border-strong hover:border-accent/60")}>
        {children}
        <span className={cn("mt-0.5 [&_svg]:size-5 [&_svg]:stroke-[1.5]", checked ? "text-accent-bright" : "text-muted-foreground")}>{icon}</span>
        <span className="min-w-0 flex-1">
            <span className="block font-serif text-[18px] leading-tight">{title}</span>
            {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
        </span>
        <span className={cn("flex size-5 shrink-0 items-center justify-center rounded-full border", checked ? "border-accent bg-accent text-accent-ink" : "border-border-strong")}>
            {checked && <Check className="animate-icon-pop size-3 stroke-[3]"/>}
        </span>
    </label>
);

/**
 * Three steps (contact, delivery, confirm) beside the order summary. The order is written to the database by
 * `place_order`, which checks prices and stock; payment stays a demo. A signed-in reader finds the form filled from
 * their profile and default address.
 */
export const CheckoutPage = () => {
    const {t} = useTranslation(["cart", "common"]);
    const {language} = useLanguage();
    const {lines, rows, totals, isLoading} = useCartSummary();
    const {user} = useAuth();
    const {data: profile} = useGetProfile();
    const {items: addresses, isFetched: addressesFetched} = useGetAddresses();
    const order = usePlaceOrder();
    const [step, setStep] = useState(0);
    const [placed, setPlaced] = useState<{number: string; email: string} | null>(null);
    const prefilled = useRef(false);

    const {register, handleSubmit, trigger, control, reset, getValues, formState: {errors, isDirty}} = useForm<CheckoutForm>({
        mode: "onTouched",
        defaultValues: {firstName: "", lastName: "", email: "", phone: "+994 ", method: "courier", city: t("checkout.placeholders.city"), address: "", note: "", payment: "cash"},
    });
    const values = useWatch({control}) as CheckoutForm;
    const required = {required: t("checkout.validation.required")};

    // Fill in what the account knows, once it has loaded, unless the reader already started typing.
    useEffect(() => {
        if (!user || !profile || !addressesFetched || isDirty || prefilled.current) return;
        prefilled.current = true;
        const [firstName = "", ...rest] = profile.fullName.split(/\s+/).filter(Boolean);
        const address = addresses.find((item) => item.isDefault) ?? addresses[0];
        const current = getValues();
        reset({
            ...current,
            firstName,
            lastName: rest.join(" "),
            email: user.email ?? "",
            phone: profile.phone || current.phone,
            ...(address && {city: address.city, address: address.line, note: address.note}),
        });
    }, [user, profile, addresses, addressesFetched, isDirty, reset, getValues]);

    const next = async () => {
        if (await trigger(STEP_FIELDS[step])) setStep((current) => Math.min(current + 1, STEPS.length - 1));
    };

    const placeOrder = handleSubmit((form) => {
        order.mutate(
            {
                items: lines.map((line) => ({bookId: line.bookId, quantity: line.quantity})),
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                phone: form.phone,
                deliveryMethod: form.method,
                city: form.method === "courier" ? form.city : "",
                address: form.method === "courier" ? form.address : "",
                note: form.method === "courier" ? form.note : "",
                paymentMethod: form.payment,
            },
            {
                onSuccess: ({number}) => {
                    setPlaced({number, email: form.email});
                    cartActions.clear();
                    window.scrollTo({top: 0, behavior: "smooth"});
                },
            },
        );
    });

    const [failureCode, failureDetail] = order.error ? splitErrorCode(order.error) : ["", ""];
    const failedBook = rows.find((row) => row.book.id === failureDetail)?.book;
    const failure = order.error
        ? t(`checkout.errors.${failureCode}`, {title: failedBook?.title[language] ?? "", defaultValue: t("checkout.errors.default")})
        : null;

    if (placed) {
        return (
            <Page className="flex min-h-[70dvh] flex-col items-center justify-center text-center">
                <span className="animate-scale-in relative flex size-24 items-center justify-center rounded-full border border-accent/60 text-accent-bright">
                    <span aria-hidden className="absolute inset-2 rounded-full border border-accent/25"/>
                    <PackageCheck className="size-10 stroke-[1.2]"/>
                </span>
                <p className="eyebrow mt-10">{t("checkout.eyebrow")}</p>
                <h1 className="mt-4 font-display text-[clamp(44px,6vw,72px)] font-medium leading-none">{t("checkout.success.title")}</h1>
                <p className="mt-6 max-w-lg font-serif text-xl text-muted-foreground">{t("checkout.success.description", {number: placed.number, email: placed.email})}</p>
                <p className="mt-3 text-xs text-faint-foreground">{user ? t("checkout.savedTo") : t("checkout.success.note")}</p>
                <div className="mt-10 flex flex-wrap justify-center gap-3">
                    {user && <Button asChild variant="outline" size="lg" className="rounded-full"><Link to={ROUTES.ACCOUNT}>{t("checkout.viewOrders")}</Link></Button>}
                    <Button asChild variant="accent" size="lg" className="rounded-full"><Link to={ROUTES.CATALOG}>{t("checkout.success.continue")}<ArrowRight/></Link></Button>
                </div>
            </Page>
        );
    }

    if (isLoading) return <Page><Skeleton className="h-16 w-2/3"/><Skeleton className="mt-10 h-96"/></Page>;

    if (rows.length === 0) {
        return (
            <Page>
                <PageTitle eyebrow={t("checkout.eyebrow")} title={t("checkout.title")}/>
                <EmptyState
                    className="mt-12"
                    quote={{text: t("empty.quote"), cite: t("empty.cite")}}
                    title={t("checkout.emptyCart")}
                    action={<Button asChild variant="outline"><Link to={ROUTES.CATALOG}>{t("empty.action")}</Link></Button>}
                />
            </Page>
        );
    }

    const review: [string, string][] = [
        [t("checkout.steps.contact"), `${values.firstName} ${values.lastName} · ${values.email} · ${values.phone}`],
        [t("checkout.method"), values.method === "courier" ? `${t("checkout.methods.courier")} · ${values.city}, ${values.address}` : `${t("checkout.methods.pickup")} · ${t("checkout.methods.pickupHint")}`],
        [t("checkout.payment"), t(`checkout.payments.${values.payment}`)],
    ];

    return (
        <Page>
            <PageTitle eyebrow={t("checkout.eyebrow")} title={t("checkout.title")}/>

            <p className="animate-fade-in mt-6 flex items-center gap-2.5 text-sm text-muted-foreground">
                <UserRound className="size-4 shrink-0 stroke-[1.5] text-accent"/>
                {user ? t("checkout.signedInAs", {email: user.email}) : <span>{t("checkout.signInHint")} <Link to={`${ROUTES.LOGIN}?next=${encodeURIComponent(ROUTES.CHECKOUT)}`} className="text-accent underline-offset-4 hover:text-accent-bright hover:underline">{t("checkout.signInLink")}</Link></span>}
            </p>

            <ol className="mt-10 flex items-center gap-3" aria-label={t("checkout.step", {current: step + 1, total: STEPS.length})}>
                {STEPS.map((id, index) => (
                    <li key={id} className="flex flex-1 items-center gap-3" aria-current={index === step ? "step" : undefined}>
                        <span className={cn("tabular flex size-8 shrink-0 items-center justify-center rounded-full border text-[13px] transition-colors duration-300", index < step ? "border-accent bg-accent text-accent-ink" : index === step ? "border-accent text-accent-bright" : "border-border-strong text-faint-foreground")}>
                            {index < step ? <Check className="size-4 stroke-[2.5]"/> : index + 1}
                        </span>
                        <span className={cn("hidden text-sm sm:block", index === step ? "text-foreground" : "text-muted-foreground")}>{t(`checkout.steps.${id}`)}</span>
                        {index < STEPS.length - 1 && <span className="h-px flex-1 bg-border"><span className="block h-full bg-accent transition-[width] duration-500" style={{width: index < step ? "100%" : "0%"}}/></span>}
                    </li>
                ))}
            </ol>

            <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-14">
                <form onSubmit={(event) => { event.preventDefault(); if (step === STEPS.length - 1) void placeOrder(); else void next(); }} noValidate className="min-w-0">
                    <div key={step} className="animate-fade-up border border-border p-6 sm:p-8">
                        {step === 0 && (
                            <div className="grid gap-5 sm:grid-cols-2">
                                <FormInput label={t("checkout.fields.firstName")} required autoComplete="given-name" placeholder={t("checkout.placeholders.firstName")} error={errors.firstName?.message} {...register("firstName", required)}/>
                                <FormInput label={t("checkout.fields.lastName")} required autoComplete="family-name" placeholder={t("checkout.placeholders.lastName")} error={errors.lastName?.message} {...register("lastName", required)}/>
                                <FormInput label={t("checkout.fields.email")} required type="email" autoComplete="email" placeholder={t("checkout.placeholders.email")} error={errors.email?.message} {...register("email", {...required, pattern: {value: EMAIL_PATTERN, message: t("checkout.validation.email")}})}/>
                                <FormInput label={t("checkout.fields.phone")} required type="tel" autoComplete="tel" placeholder={t("checkout.placeholders.phone")} error={errors.phone?.message} {...register("phone", {...required, pattern: {value: AZ_PHONE_PATTERN, message: t("checkout.validation.phone")}})}/>
                            </div>
                        )}

                        {step === 1 && (
                            <div className="flex flex-col gap-7">
                                <fieldset>
                                    <legend className="mb-3 text-[13px] font-medium">{t("checkout.method")}</legend>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <ChoiceCard checked={values.method === "courier"} icon={<Truck/>} title={t("checkout.methods.courier")} hint={t("checkout.methods.courierHint")}>
                                            <input type="radio" value="courier" className="sr-only" {...register("method")}/>
                                        </ChoiceCard>
                                        <ChoiceCard checked={values.method === "pickup"} icon={<Store/>} title={t("checkout.methods.pickup")} hint={t("checkout.methods.pickupHint")}>
                                            <input type="radio" value="pickup" className="sr-only" {...register("method")}/>
                                        </ChoiceCard>
                                    </div>
                                </fieldset>
                                {values.method === "courier" && (
                                    <div className="animate-fade-up grid gap-5 sm:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)]">
                                        <FormInput label={t("checkout.fields.city")} required autoComplete="address-level2" error={errors.city?.message} {...register("city", {validate: (value, form) => form.method === "pickup" || value.trim().length > 0 || t("checkout.validation.required")})}/>
                                        <FormInput label={t("checkout.fields.address")} required autoComplete="street-address" placeholder={t("checkout.placeholders.address")} error={errors.address?.message} {...register("address", {validate: (value, form) => form.method === "pickup" || value.trim().length > 0 || t("checkout.validation.required")})}/>
                                        <FormTextarea label={t("checkout.fields.note")} placeholder={t("checkout.placeholders.note")} containerClassName="sm:col-span-2" {...register("note")}/>
                                    </div>
                                )}
                                <fieldset>
                                    <legend className="mb-3 text-[13px] font-medium">{t("checkout.payment")}</legend>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {(["cash", "card"] as const).map((id) => (
                                            <ChoiceCard key={id} checked={values.payment === id} icon={<span className="font-serif text-lg leading-none">₼</span>} title={t(`checkout.payments.${id}`)}>
                                                <input type="radio" value={id} className="sr-only" {...register("payment")}/>
                                            </ChoiceCard>
                                        ))}
                                    </div>
                                </fieldset>
                            </div>
                        )}

                        {step === 2 && (
                            <div>
                                <h2 className="font-serif text-2xl">{t("checkout.review")}</h2>
                                <dl className="mt-5 divide-y divide-border border-y border-border">
                                    {review.map(([label, value], index) => (
                                        <div key={label} className="grid gap-1 py-4 sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:items-baseline sm:gap-4">
                                            <dt className="text-[13px] text-muted-foreground">{label}</dt>
                                            <dd className="break-words font-serif text-[17px]">{value}</dd>
                                            <button type="button" onClick={() => setStep(index === 0 ? 0 : 1)} className="w-fit cursor-pointer text-xs text-accent hover:text-accent-bright">{t("checkout.edit")}</button>
                                        </div>
                                    ))}
                                </dl>
                                <p className="mt-6 flex gap-2.5 text-[13px] leading-relaxed text-muted-foreground"><Info className="mt-0.5 size-4 shrink-0 text-accent"/>{t("checkout.savedNote")}</p>
                            </div>
                        )}
                    </div>

                    {failure && (
                        <p role="alert" className="animate-fade-in mt-6 flex gap-2.5 border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger"><AlertCircle className="mt-0.5 size-4 shrink-0"/>{failure}</p>
                    )}
                    <div className="mt-6 flex items-center justify-between gap-3">
                        {step > 0 ? <Button type="button" variant="ghost" size="lg" onClick={() => setStep((current) => current - 1)}><ArrowLeft/>{t("checkout.back")}</Button> : <span/>}
                        <Button type="submit" variant="accent" size="lg" loading={order.isPending} className="rounded-full px-8">
                            {step === STEPS.length - 1 ? t("checkout.place") : t("checkout.next")}
                            <ArrowRight/>
                        </Button>
                    </div>
                </form>

                <OrderSummary rows={rows} totals={totals}/>
            </div>
        </Page>
    );
};
