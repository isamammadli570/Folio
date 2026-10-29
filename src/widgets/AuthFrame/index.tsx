import type {ReactNode} from "react";
import {useTranslation} from "react-i18next";
import {Astrolabe} from "@/widgets/Astrolabe";
import {GoldDust} from "@/widgets/GoldDust";
import {Page} from "@/widgets/Page";

type AuthFrameProps = {
    title: string;
    subtitle?: string;
    children: ReactNode;
    /** The line under the form ("No account yet? Create one"). */
    footer?: ReactNode;
};

/** Sign-in pages: a reading-room panel with the astrolabe and a quotation beside a narrow form. */
export const AuthFrame = ({title, subtitle, children, footer}: AuthFrameProps) => {
    const {t} = useTranslation("account");
    return (
        <Page className="flex min-h-[calc(100dvh-var(--header-h))] items-center">
            <div className="grid w-full overflow-hidden border border-border lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
                <aside aria-hidden className="relative hidden min-h-[560px] overflow-hidden border-r border-border bg-surface lg:block">
                    <Astrolabe className="-left-40 -top-40 w-[680px] opacity-80"/>
                    <GoldDust className="absolute inset-0" count={14} seed={11}/>
                    <div className="absolute inset-x-10 bottom-10">
                        <span className="block h-px w-16 bg-accent"/>
                        <blockquote className="mt-6 font-serif text-[28px] italic leading-snug [text-wrap:balance]">«{t("auth.quote.text")}»</blockquote>
                        <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-accent">{t("auth.quote.cite")}</p>
                    </div>
                </aside>
                <section className="animate-fade-up px-6 py-10 sm:px-12 sm:py-14">
                    <p className="eyebrow">{t("auth.eyebrow")}</p>
                    <h1 className="mt-3 font-serif text-[clamp(34px,4vw,48px)] leading-[1.05] [text-wrap:balance]">{title}</h1>
                    {subtitle && <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-muted-foreground">{subtitle}</p>}
                    <div className="mt-8">{children}</div>
                    {footer && <p className="mt-8 border-t border-border pt-6 text-sm text-muted-foreground">{footer}</p>}
                </section>
            </div>
        </Page>
    );
};
