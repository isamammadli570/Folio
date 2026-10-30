import {useState} from "react";
import {BellRing} from "lucide-react";
import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {EMAIL_PATTERN} from "@/constants/validation";
import {useRequestStockAlert} from "@/hooks/reviews";
import {useAuth} from "@/hooks/useAuth";
import {useLanguage} from "@/hooks/useLanguage";

/** For a sold-out book: leave an email and the shop knows who is waiting for it. Signed-in readers get their own address filled in. */
export const StockAlert = ({bookId}: {bookId: string}) => {
    const {t} = useTranslation("catalog");
    const {language} = useLanguage();
    const {user} = useAuth();
    const [email, setEmail] = useState(user?.email ?? "");
    const [isInvalid, setIsInvalid] = useState(false);
    const request = useRequestStockAlert();

    if (request.isSuccess) {
        return <p className="animate-fade-in mt-5 flex items-center gap-2.5 text-sm text-success"><BellRing className="size-4"/>{t("alert.done")}</p>;
    }

    return (
        <form
            noValidate
            onSubmit={(event) => {
                event.preventDefault();
                if (!EMAIL_PATTERN.test(email.trim())) return setIsInvalid(true);
                request.mutate({bookId, email, language});
            }}
            className="animate-fade-up mt-5 border border-border bg-surface p-4"
        >
            <p className="flex items-center gap-2 font-serif text-lg"><BellRing className="size-4 text-accent"/>{t("alert.title")}</p>
            <p className="mt-1 text-[13px] text-muted-foreground">{t("alert.text")}</p>
            <div className="mt-3 flex flex-wrap gap-2">
                <Input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => { setEmail(event.target.value); setIsInvalid(false); }}
                    placeholder={t("alert.placeholder")}
                    aria-label={t("alert.placeholder")}
                    aria-invalid={isInvalid || undefined}
                    className="min-w-0 flex-1 basis-48"
                />
                <Button type="submit" variant="accent" loading={request.isPending} className="rounded-full px-5">{t("alert.submit")}</Button>
            </div>
            {isInvalid && <p role="alert" className="mt-2 text-xs text-danger">{t("alert.invalid")}</p>}
        </form>
    );
};
