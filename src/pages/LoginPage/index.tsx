import {Link, useNavigate, useSearchParams} from "react-router";
import {useForm} from "react-hook-form";
import {useMutation} from "@tanstack/react-query";
import {ArrowRight} from "lucide-react";
import {useTranslation} from "react-i18next";
import {toast} from "sonner";
import {signIn} from "@/api/auth.api";
import {Button} from "@/components/ui/button";
import {FormInput} from "@/components/form/FormInput";
import {FormPassword} from "@/components/form/FormPassword";
import {ROUTES, safeNext} from "@/constants/routes";
import {EMAIL_PATTERN} from "@/constants/validation";
import {errorCode} from "@/helpers/apiError";
import {userIdentity} from "@/helpers/user";
import {AuthFrame} from "@/widgets/AuthFrame";
import {FormAlert} from "@/widgets/AuthFrame/FormAlert";
import {GoogleButton} from "@/widgets/AuthFrame/GoogleButton";

type LoginForm = {email: string; password: string};

export const LoginPage = () => {
    const {t} = useTranslation("account");
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const next = params.get("next");
    const {register, handleSubmit, formState: {errors}} = useForm<LoginForm>({mode: "onTouched", defaultValues: {email: "", password: ""}});
    const required = {required: t("auth.validation.required")};

    const login = useMutation({
        mutationFn: signIn,
        meta: {suppressGlobalError: true},
        onSuccess: ({user}) => {
            const name = userIdentity(user).name.split(" ")[0];
            toast.success(t("auth.login.welcome", {name}));
            navigate(safeNext(next), {replace: true});
        },
    });
    const withNext = (path: string) => (next ? `${path}?next=${encodeURIComponent(next)}` : path);

    return (
        <AuthFrame
            title={t("auth.login.title")}
            subtitle={t("auth.login.subtitle")}
            footer={<>{t("auth.login.noAccount")} <Link to={withNext(ROUTES.REGISTER)} className="text-accent underline-offset-4 hover:text-accent-bright hover:underline">{t("auth.login.register")}</Link></>}
        >
            <GoogleButton next={safeNext(next)}/>
            <div className="h-5"/>
            <form onSubmit={handleSubmit((form) => login.mutate(form))} noValidate className="flex flex-col gap-5">
                <FormInput label={t("auth.fields.email")} required type="email" autoComplete="email" placeholder={t("auth.placeholders.email")} error={errors.email?.message} {...register("email", {...required, pattern: {value: EMAIL_PATTERN, message: t("auth.validation.email")}})}/>
                <div>
                    <FormPassword label={t("auth.fields.password")} required autoComplete="current-password" placeholder={t("auth.placeholders.password")} error={errors.password?.message} {...register("password", required)}/>
                    <Link to={ROUTES.FORGOT_PASSWORD} className="mt-2 inline-block text-xs text-muted-foreground hover:text-accent-bright">{t("auth.login.forgot")}</Link>
                </div>
                <FormAlert code={login.error ? errorCode(login.error) : null}/>
                <Button type="submit" variant="accent" size="lg" loading={login.isPending} className="mt-2 rounded-full">
                    {t("auth.login.submit")}<ArrowRight/>
                </Button>
            </form>
        </AuthFrame>
    );
};
