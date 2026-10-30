import type {ReactNode} from "react";
import {Link} from "react-router";
import {ArrowRight} from "lucide-react";
import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button";
import {useSignInNudge} from "@/hooks/useSignInNudge";
import {cn} from "@/lib/utils";

type SignInNudgeProps = {
    icon: ReactNode;
    title: string;
    text: string;
    /** A second way forward, e.g. "Continue as a guest" at checkout. */
    secondary?: ReactNode;
    className?: string;
};

/** A quiet card that tells a guest what an account adds, with a sign-in button that brings them back here. Hidden once signed in. */
export const SignInNudge = ({icon, title, text, secondary, className}: SignInNudgeProps) => {
    const {t} = useTranslation();
    const {isGuest, loginPath} = useSignInNudge();
    if (!isGuest) return null;

    return (
        <div className={cn("animate-fade-up relative flex flex-wrap items-center gap-x-5 gap-y-4 overflow-hidden rounded-xl border border-accent/35 bg-accent-soft/40 px-5 py-4", className)}>
            <span aria-hidden className="absolute -left-8 -top-8 size-28 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_16%,transparent),transparent_70%)]"/>
            <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full border border-accent/50 text-accent-bright [&_svg]:size-[18px] [&_svg]:stroke-[1.4]">{icon}</span>
            <div className="relative min-w-0 flex-1 basis-60">
                <p className="font-serif text-[18px] leading-tight">{title}</p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">{text}</p>
            </div>
            <div className="relative flex flex-wrap items-center gap-2">
                {secondary}
                <Button asChild variant="accent" className="rounded-full px-5">
                    <Link to={loginPath}>{t("nudge.signIn")}<ArrowRight/></Link>
                </Button>
            </div>
        </div>
    );
};
