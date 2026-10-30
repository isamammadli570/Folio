import {useState} from "react";
import {Link, useNavigate, useSearchParams} from "react-router";
import {useForm} from "react-hook-form";
import {useMutation} from "@tanstack/react-query";
import {ArrowRight, MailCheck} from "lucide-react";
import {useTranslation} from "react-i18next";
import {toast} from "sonner";
import {signUp} from "@/api/auth.api";
import {Button} from "@/components/ui/button";
import {FormInput} from "@/components/form/FormInput";
import {FormPassword} from "@/components/form/FormPassword";
import {ROUTES, safeNext} from "@/constants/routes";
import {EMAIL_PATTERN, PASSWORD_MIN_LENGTH} from "@/constants/validation";
import {errorCode} from "@/helpers/apiError";
import {AuthFrame} from "@/widgets/AuthFrame";
import {FormAlert} from "@/widgets/AuthFrame/FormAlert";
import {GoogleButton} from "@/widgets/AuthFrame/GoogleButton";

type RegisterForm = {fullName: string; email: string; password: string};

export const RegisterPage = () => {
    const {t} = useTranslation("account");
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const next = params.get("next");
    const [pendingEmail, setPendingEmail] = useState<string | null>(null);
    const {register, handleSubmit, formState: {errors}} = useForm<RegisterForm>({mode: "onTouched", defaultValues: {fullName: "", email: "", password: ""}});
    const required = {required: t("auth.validation.required")};
    const passwordRule = t("auth.validation.passwordLength", {count: PASSWORD_MIN_LENGTH});

    const create = useMutation({
        mutationFn: signUp,
        meta: {suppressGlobalError: true},
        onSuccess: ({needsConfirmation}, form) => {
            if (needsConfirmation) {
                setPendingEmail(form.email.trim());
                return;
            }
            toast.success(t("auth.register.created"));
            navigate(safeNext(next), {replace: true});
        },
    });

    if (pendingEmail) {
        return (
            <AuthFrame title={t("auth.register.checkEmail.title")}>
                <div className="animate-fade-up flex flex-col items-start gap-6">
                    <span className="flex size-16 items-center justify-center rounded-full border border-accent/60 text-accent-bright"><MailCheck className="size-7 stroke-[1.3]"/></span>
                    <p className="max-w-[46ch] font-serif text-xl leading-relaxed text-muted-foreground">{t("auth.register.checkEmail.description", {email: pendingEmail})}</p>
                    <Button asChild variant="outline" className="rounded-full"><Link to={ROUTES.LOGIN}>{t("auth.register.checkEmail.back")}</Link></Button>
                </div>
            </AuthFrame>
        );
    }

    return (
        <AuthFrame
            title={t("auth.register.title")}
            subtitle={t("auth.register.subtitle")}
            footer={<>{t("auth.register.hasAccount")} <Link to={next ? `${ROUTES.LOGIN}?next=${encodeURIComponent(next)}` : ROUTES.LOGIN} className="text-accent underline-offset-4 hover:text-accent-bright hover:underline">{t("auth.register.login")}</Link></>}
        >
            <GoogleButton next={safeNext(next)}/>
            <div className="h-5"/>
            <form onSubmit={handleSubmit((form) => create.mutate(form))} noValidate className="flex flex-col gap-5">
                <FormInput label={t("auth.fields.fullName")} required autoComplete="name" placeholder={t("auth.placeholders.fullName")} error={errors.fullName?.message} {...register("fullName", {validate: (value) => value.trim().length > 0 || t("auth.validation.required")})}/>
                <FormInput label={t("auth.fields.email")} required type="email" autoComplete="email" placeholder={t("auth.placeholders.email")} error={errors.email?.message} {...register("email", {...required, pattern: {value: EMAIL_PATTERN, message: t("auth.validation.email")}})}/>
                <FormPassword
                    label={t("auth.fields.password")}
                    required
                    autoComplete="new-password"
                    placeholder={t("auth.placeholders.password")}
                    hint={passwordRule}
                    error={errors.password?.message}
                    {...register("password", {...required, minLength: {value: PASSWORD_MIN_LENGTH, message: passwordRule}})}
                />
                <FormAlert code={create.error ? errorCode(create.error) : null}/>
                <Button type="submit" variant="accent" size="lg" loading={create.isPending} className="mt-2 rounded-full">
                    {t("auth.register.submit")}<ArrowRight/>
                </Button>
            </form>
        </AuthFrame>
    );
};
