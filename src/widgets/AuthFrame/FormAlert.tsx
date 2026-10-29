import {useTranslation} from "react-i18next";

/** The reason a sign-in form failed, translated from the auth error code; nothing while `code` is null. */
export const FormAlert = ({code}: {code: string | null}) => {
    const {t} = useTranslation("account");
    if (code === null) return null;
    return (
        <p role="alert" className="animate-fade-in border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
            {t(`auth.errors.${code}`, {defaultValue: t("auth.errors.default")})}
        </p>
    );
};
