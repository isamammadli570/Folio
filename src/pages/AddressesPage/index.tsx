import {useState, type CSSProperties} from "react";
import {useForm} from "react-hook-form";
import {MapPin, Pencil, Plus, Star, Trash2} from "lucide-react";
import {useTranslation} from "react-i18next";
import type {AddressInput} from "@/api/account.api";
import type {Address} from "@/api/types";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {FormInput} from "@/components/form/FormInput";
import {FormTextarea} from "@/components/form/FormTextarea";
import {useDeleteAddress, useGetAddresses, useSaveAddress} from "@/hooks/account";
import {PageTitle} from "@/widgets/PageTitle";
import {QueryErrorState} from "@/widgets/QueryErrorState";
import {cn} from "@/lib/utils";

type AddressFormProps = {
    address?: Address;
    isFirst: boolean;
    onDone: () => void;
};

const AddressForm = ({address, isFirst, onDone}: AddressFormProps) => {
    const {t} = useTranslation("account");
    const save = useSaveAddress();
    const {register, handleSubmit, formState: {errors}} = useForm<AddressInput>({
        mode: "onTouched",
        defaultValues: address ?? {label: "", city: t("addresses.placeholders.city"), line: "", note: "", isDefault: isFirst},
    });
    const filled = (value: string) => value.trim().length > 0 || t("auth.validation.required");

    return (
        <form
            onSubmit={handleSubmit((input) => save.mutate({input, addressId: address?.id}, {onSuccess: onDone}))}
            noValidate
            className="animate-fade-up grid grid-cols-[minmax(0,1fr)] gap-5 border border-accent/50 bg-accent-soft/30 p-5 sm:grid-cols-2 sm:p-6"
        >
            <p className="font-serif text-xl sm:col-span-2">{address ? t("addresses.edit") : t("addresses.new")}</p>
            <FormInput label={t("addresses.fields.label")} placeholder={t("addresses.placeholders.label")} {...register("label")}/>
            <FormInput label={t("addresses.fields.city")} required autoComplete="address-level2" error={errors.city?.message} {...register("city", {validate: filled})}/>
            <FormInput label={t("addresses.fields.line")} required autoComplete="street-address" placeholder={t("addresses.placeholders.line")} containerClassName="sm:col-span-2" error={errors.line?.message} {...register("line", {validate: filled})}/>
            <FormTextarea label={t("addresses.fields.note")} placeholder={t("addresses.placeholders.note")} containerClassName="sm:col-span-2" {...register("note")}/>
            <label className="flex cursor-pointer items-center gap-2.5 text-sm sm:col-span-2">
                <input type="checkbox" className="size-4 accent-[var(--accent)]" {...register("isDefault")}/>
                {t("addresses.fields.isDefault")}
            </label>
            <div className="flex gap-3 sm:col-span-2">
                <Button type="submit" variant="accent" loading={save.isPending} className="rounded-full px-6">{t("addresses.save")}</Button>
                <Button type="button" variant="ghost" onClick={onDone}>{t("addresses.cancel")}</Button>
            </div>
        </form>
    );
};

const AddressCard = ({address, index, onEdit}: {address: Address; index: number; onEdit: () => void}) => {
    const {t} = useTranslation("account");
    const remove = useDeleteAddress();
    const save = useSaveAddress();
    const [confirming, setConfirming] = useState(false);

    return (
        <li
            className={cn("animate-fade-up relative flex flex-col gap-3 border p-5 transition-colors", address.isDefault ? "border-accent/70" : "border-border hover:border-border-strong")}
            style={{animationDelay: `${index * 60}ms`} as CSSProperties}
        >
            <div className="flex items-start gap-3">
                <MapPin className="mt-1 size-4 shrink-0 stroke-[1.5] text-accent"/>
                <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 font-serif text-xl leading-tight">
                        {address.label || address.city}
                        {address.isDefault && <span className="rounded-full bg-accent-soft px-2 py-0.5 font-sans text-[11px] text-accent-bright">{t("addresses.default")}</span>}
                    </p>
                    <p className="mt-1.5 text-sm text-muted-foreground">{address.city}, {address.line}</p>
                    {address.note && <p className="mt-1 text-xs text-faint-foreground">{address.note}</p>}
                </div>
            </div>
            <div className="mt-auto flex flex-wrap items-center gap-1 pt-2 text-xs">
                <Button variant="ghost" size="sm" onClick={onEdit}><Pencil/>{t("addresses.edit")}</Button>
                {!address.isDefault && (
                    <Button variant="ghost" size="sm" loading={save.isPending} onClick={() => save.mutate({input: {...address, isDefault: true}, addressId: address.id})}>
                        <Star/>{t("addresses.makeDefault")}
                    </Button>
                )}
                {confirming ? (
                    <span className="ml-auto flex items-center gap-1">
                        <span className="px-2 text-muted-foreground">{t("addresses.confirmDelete")}</span>
                        <Button variant="ghost" size="sm" className="text-danger" loading={remove.isPending} onClick={() => remove.mutate(address.id)}>{t("addresses.delete")}</Button>
                        <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>{t("addresses.cancel")}</Button>
                    </span>
                ) : (
                    <Button variant="ghost" size="sm" className="ml-auto hover:text-danger" onClick={() => setConfirming(true)} aria-label={t("addresses.delete")}><Trash2/></Button>
                )}
            </div>
        </li>
    );
};

export const AddressesPage = () => {
    const {t} = useTranslation("account");
    const {items: addresses, isLoading, isError, refetch} = useGetAddresses();
    // "new" for the blank form, an id for editing that address, null when no form is open.
    const [editing, setEditing] = useState<string | null>(null);
    const close = () => setEditing(null);

    return (
        <section>
            <PageTitle
                title={t("addresses.title")}
                description={t("addresses.subtitle")}
                actions={editing === null && addresses.length > 0 && <Button variant="outline" className="rounded-full" onClick={() => setEditing("new")}><Plus/>{t("addresses.add")}</Button>}
            />
            <div className="mt-10">
                {isLoading ? (
                    <div className="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2">{[0, 1].map((key) => <Skeleton key={key} className="h-40"/>)}</div>
                ) : isError ? (
                    <QueryErrorState onRetry={() => void refetch()}/>
                ) : (
                    <div className="space-y-6">
                        {editing === "new" && <AddressForm isFirst={addresses.length === 0} onDone={close}/>}
                        {addresses.length === 0 && editing !== "new" ? (
                            <button
                                type="button"
                                onClick={() => setEditing("new")}
                                className="flex w-full cursor-pointer flex-col items-center gap-3 border border-dashed border-border-strong px-6 py-14 text-center text-muted-foreground outline-none transition-colors hover:border-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40"
                            >
                                <span className="flex size-12 items-center justify-center rounded-full border border-accent/50 text-accent"><Plus className="size-5"/></span>
                                <span className="text-sm">{t("addresses.empty")}</span>
                                <span className="font-serif text-lg text-foreground">{t("addresses.add")}</span>
                            </button>
                        ) : (
                            <ul className="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2">
                                {addresses.map((address, index) =>
                                    editing === address.id ? (
                                        <li key={address.id} className="sm:col-span-2"><AddressForm address={address} isFirst={false} onDone={close}/></li>
                                    ) : (
                                        <AddressCard key={address.id} address={address} index={index} onEdit={() => setEditing(address.id)}/>
                                    ),
                                )}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};
