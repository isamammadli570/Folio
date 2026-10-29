import {useTranslation} from "react-i18next";
import {Logo} from "@/widgets/Logo";

/** The monogram breathing over a thin travelling bar; shown while a page's code is fetched. */
export const Loading = () => {
    const {t} = useTranslation();

    return (
        <div role="status" aria-label={t("loading")} className="flex min-h-[60dvh] animate-fade-in flex-col items-center justify-center gap-6">
            <span className="animate-pulse"><Logo compact/></span>
            <div className="relative h-px w-28 overflow-hidden bg-border">
                <div className="absolute inset-y-0 left-0 w-2/5 bg-accent [animation:indeterminate_1.2s_ease-in-out_infinite]"/>
            </div>
        </div>
    );
};
