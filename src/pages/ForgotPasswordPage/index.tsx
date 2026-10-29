import {Link} from "react-router";
import {useForm} from "react-hook-form";
import {useMutation} from "@tanstack/react-query";
import {ArrowLeft, MailCheck} from "lucide-react";
import {useTranslation} from "react-i18next";
import {sendPasswordReset} from "@/api/auth.api";
import {Button} from "@/components/ui/button";
import {FormInput} from "@/components/form/FormInput";
import {ROUTES} from "@/constants/routes";
import {EMAIL_PATTERN} from "@/constants/validation";
import {errorCode} from "@/helpers/apiError";
import {AuthFrame} from "@/widgets/AuthFrame";
import {FormAlert} from "@/widgets/AuthFrame/FormAlert";

/** Sends the reset link. The answer is the same whether or not the address has an account. */
export const ForgotPasswordPage = () => {
    const {t} = useTranslation("account");
    const {register, handleSubmit, formState: {errors}} = useForm<{email: string}>({mode: "onTouched", defaultValues: {email: ""}});
    const send = useMutation({mutationFn: sendPasswordReset, meta: {suppressGlobalError: true}});
    const back = <Link to={ROUTES.LOGIN} className="inline-flex items-center gap-1.5 text-accent hover:text-accent-bright"><ArrowLeft className="size-3.5"/>{t("auth.forgot.back")}</Link>;

    return (
        <AuthFrame title={t("auth.forgot.title")} subtitle={send.isSuccess ? undefined : t("auth.forgot.subtitle")} footer={back}>
            {send.isSuccess ? (
                <div className="animate-fade-up flex items-start gap-4">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-accent/60 text-accent-bright"><MailCheck className="size-5 stroke-[1.4]"/></span>
                    <p className="font-serif text-xl leading-relaxed text-muted-foreground">{t("auth.forgot.sent", {email: send.variables})}</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit(({email}) => send.mutate(email.trim()))} noValidate className="flex flex-col gap-5">
                    <FormInput label={t("auth.fields.email")} required type="email" autoComplete="email" placeholder={t("auth.placeholders.email")} error={errors.email?.message} {...register("email", {required: t("auth.validation.required"), pattern: {value: EMAIL_PATTERN, message: t("auth.validation.email")}})}/>
                    <FormAlert code={send.error ? errorCode(send.error) : null}/>
                    <Button type="submit" variant="accent" size="lg" loading={send.isPending} className="mt-2 rounded-full">{t("auth.forgot.submit")}</Button>
                </form>
            )}
        </AuthFrame>
    );
};
