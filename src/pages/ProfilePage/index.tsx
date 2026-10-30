import {useForm} from "react-hook-form";
import {useMutation} from "@tanstack/react-query";
import {KeyRound} from "lucide-react";
import {useTranslation} from "react-i18next";
import {toast} from "sonner";
import {updatePassword} from "@/api/auth.api";
import type {Profile} from "@/api/types";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Skeleton} from "@/components/ui/skeleton";
import {FormField} from "@/components/form/FormField";
import {FormInput} from "@/components/form/FormInput";
import {FormPassword} from "@/components/form/FormPassword";
import {AZ_PHONE_PATTERN, PASSWORD_MIN_LENGTH} from "@/constants/validation";
import {errorCode} from "@/helpers/apiError";
import {formatDate} from "@/helpers/format";
import {useGetProfile, useUpdateProfile} from "@/hooks/account";
import {useAuth} from "@/hooks/useAuth";
import {useLanguage} from "@/hooks/useLanguage";
import {FormAlert} from "@/widgets/AuthFrame/FormAlert";
import {PageTitle} from "@/widgets/PageTitle";

type ProfileForm = Pick<Profile, "fullName" | "phone">;

const ProfileDetails = ({profile}: {profile: Profile}) => {
    const {t} = useTranslation("account");
    const {t: tc} = useTranslation("cart");
    const {user} = useAuth();
    const update = useUpdateProfile();
    const {register, handleSubmit, reset, formState: {errors, isDirty}} = useForm<ProfileForm>({
        mode: "onTouched",
        defaultValues: {fullName: profile.fullName, phone: profile.phone || "+994 "},
    });

    return (
        <form
            onSubmit={handleSubmit((form) => update.mutate({...profile, ...form}, {onSuccess: (saved) => reset({fullName: saved.fullName, phone: saved.phone})}))}
            noValidate
            className="grid grid-cols-[minmax(0,1fr)] gap-5 border border-border p-5 sm:grid-cols-2 sm:p-8"
        >
            <FormInput label={t("auth.fields.fullName")} required autoComplete="name" error={errors.fullName?.message} {...register("fullName", {validate: (value) => value.trim().length > 0 || t("auth.validation.required")})}/>
            <FormInput label={tc("checkout.fields.phone")} type="tel" autoComplete="tel" placeholder={tc("checkout.placeholders.phone")} error={errors.phone?.message} {...register("phone", {validate: (value) => value.trim() === "+994" || value.trim() === "" || AZ_PHONE_PATTERN.test(value) || tc("checkout.validation.phone")})}/>
            <FormField label={t("auth.fields.email")} hint={t("profile.emailHint")} className="sm:col-span-2">
                <Input value={user?.email ?? ""} readOnly disabled/>
            </FormField>
            <div className="sm:col-span-2">
                <Button type="submit" variant="accent" disabled={!isDirty} loading={update.isPending} className="rounded-full px-7">{t("profile.save")}</Button>
            </div>
        </form>
    );
};

const PasswordChange = () => {
    const {t} = useTranslation("account");
    const passwordRule = t("auth.validation.passwordLength", {count: PASSWORD_MIN_LENGTH});
    const {register, handleSubmit, reset, formState: {errors}} = useForm<{password: string; confirm: string}>({mode: "onTouched", defaultValues: {password: "", confirm: ""}});
    const change = useMutation({
        mutationFn: updatePassword,
        meta: {suppressGlobalError: true},
        onSuccess: () => {
            reset();
            toast.success(t("profile.passwordChanged"));
        },
    });

    return (
        <form onSubmit={handleSubmit(({password}) => change.mutate(password))} noValidate className="grid grid-cols-[minmax(0,1fr)] gap-5 border border-border p-5 sm:grid-cols-2 sm:p-8">
            <div className="flex items-start gap-3 sm:col-span-2">
                <KeyRound className="mt-1 size-5 stroke-[1.4] text-accent"/>
                <div>
                    <p className="font-serif text-xl">{t("profile.security")}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{t("profile.securityHint")}</p>
                </div>
            </div>
            <FormPassword label={t("auth.fields.newPassword")} required autoComplete="new-password" hint={passwordRule} error={errors.password?.message} {...register("password", {required: t("auth.validation.required"), minLength: {value: PASSWORD_MIN_LENGTH, message: passwordRule}})}/>
            <FormPassword label={t("auth.fields.confirmPassword")} required autoComplete="new-password" error={errors.confirm?.message} {...register("confirm", {validate: (value, form) => value === form.password || t("auth.validation.passwordMatch")})}/>
            <div className="sm:col-span-2"><FormAlert code={change.error ? errorCode(change.error) : null}/></div>
            <div className="sm:col-span-2">
                <Button type="submit" variant="outline" loading={change.isPending} className="rounded-full px-7">{t("profile.changePassword")}</Button>
            </div>
        </form>
    );
};

export const ProfilePage = () => {
    const {t} = useTranslation("account");
    const {language} = useLanguage();
    const {user} = useAuth();
    const {data: profile, isLoading} = useGetProfile();

    return (
        <section>
            <PageTitle
                title={t("profile.title")}
                description={t("profile.subtitle")}
                actions={user && <p className="text-xs uppercase tracking-[0.2em] text-accent">{t("profile.memberSince", {date: formatDate(user.created_at, language)})}</p>}
            />
            <div className="mt-10 space-y-6">
                {isLoading || !profile ? <Skeleton className="h-64"/> : <ProfileDetails profile={profile}/>}
                <PasswordChange/>
            </div>
        </section>
    );
};
