import {Link, useNavigate} from "react-router";
import {useForm} from "react-hook-form";
import {useMutation} from "@tanstack/react-query";
import {useTranslation} from "react-i18next";
import {toast} from "sonner";
import {updatePassword} from "@/api/auth.api";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {FormPassword} from "@/components/form/FormPassword";
import {ROUTES} from "@/constants/routes";
import {PASSWORD_MIN_LENGTH} from "@/constants/validation";
import {errorCode} from "@/helpers/apiError";
import {useAuth} from "@/hooks/useAuth";
import {AuthFrame} from "@/widgets/AuthFrame";
import {FormAlert} from "@/widgets/AuthFrame/FormAlert";

type ResetForm = {password: string; confirm: string};

/**
 * The page the reset email links to. Supabase reads the token from the link and signs the reader in for this one step;
 * without that session the link was stale, and the page offers a new one.
 */
export const ResetPasswordPage = () => {
    const {t} = useTranslation("account");
    const navigate = useNavigate();
    const {user, isReady} = useAuth();
    const {register, handleSubmit, formState: {errors}} = useForm<ResetForm>({mode: "onTouched", defaultValues: {password: "", confirm: ""}});
    const passwordRule = t("auth.validation.passwordLength", {count: PASSWORD_MIN_LENGTH});

    const update = useMutation({
        mutationFn: updatePassword,
        meta: {suppressGlobalError: true},
        onSuccess: () => {
            toast.success(t("auth.reset.done"));
            navigate(ROUTES.ACCOUNT, {replace: true});
        },
    });

    if (!isReady) return <AuthFrame title={t("auth.reset.title")}><Skeleton className="h-40"/></AuthFrame>;

    if (!user) {
        return (
            <AuthFrame title={t("auth.reset.title")}>
                <p className="font-serif text-xl leading-relaxed text-muted-foreground">{t("auth.reset.invalid")}</p>
                <Button asChild variant="outline" className="mt-6 rounded-full"><Link to={ROUTES.FORGOT_PASSWORD}>{t("auth.reset.requestNew")}</Link></Button>
            </AuthFrame>
        );
    }

    return (
        <AuthFrame title={t("auth.reset.title")} subtitle={t("auth.reset.subtitle")}>
            <form onSubmit={handleSubmit(({password}) => update.mutate(password))} noValidate className="flex flex-col gap-5">
                <FormPassword label={t("auth.fields.newPassword")} required autoComplete="new-password" hint={passwordRule} error={errors.password?.message} {...register("password", {required: t("auth.validation.required"), minLength: {value: PASSWORD_MIN_LENGTH, message: passwordRule}})}/>
                <FormPassword label={t("auth.fields.confirmPassword")} required autoComplete="new-password" error={errors.confirm?.message} {...register("confirm", {validate: (value, form) => value === form.password || t("auth.validation.passwordMatch")})}/>
                <FormAlert code={update.error ? errorCode(update.error) : null}/>
                <Button type="submit" variant="accent" size="lg" loading={update.isPending} className="mt-2 rounded-full">{t("auth.reset.submit")}</Button>
            </form>
        </AuthFrame>
    );
};
