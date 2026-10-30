import {useState, type CSSProperties, type FormEvent} from "react";
import {Link} from "react-router";
import {ArrowUp, ArrowUpRight, Clock, Mail, MapPin} from "lucide-react";
import {useTranslation} from "react-i18next";
import {toast} from "sonner";
import {NAV_GROUPS} from "@/constants/sidebar";
import {ROUTES} from "@/constants/routes";
import {EMAIL_PATTERN} from "@/constants/validation";
import {Logo} from "@/widgets/Logo";
import {Reveal} from "@/widgets/Reveal";

/** "Quote of the week" sign-up. A demo: it checks the address and thanks the visitor; nothing is sent anywhere. */
const Newsletter = () => {
    const {t} = useTranslation();
    const [email, setEmail] = useState("");
    const [error, setError] = useState(false);

    const subscribe = (event: FormEvent) => {
        event.preventDefault();
        if (!EMAIL_PATTERN.test(email.trim())) {
            setError(true);
            return;
        }
        toast(t("footer.subscribed"));
        setEmail("");
    };

    return (
        <form onSubmit={subscribe} noValidate className="max-w-sm">
            <p className="text-[10.5px] font-medium uppercase tracking-[0.22em] text-accent">{t("footer.newsletterTitle")}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t("footer.newsletterText")}</p>
            <div className="group mt-4 flex items-center border-b border-border-strong transition-colors focus-within:border-accent">
                <label htmlFor="footer-email" className="sr-only">{t("footer.emailPlaceholder")}</label>
                <input
                    id="footer-email"
                    type="email"
                    value={email}
                    onChange={(event) => { setEmail(event.target.value); setError(false); }}
                    placeholder={t("footer.emailPlaceholder")}
                    aria-invalid={error || undefined}
                    className="h-11 min-w-0 flex-1 bg-transparent font-serif text-lg outline-none placeholder:text-faint-foreground"
                />
                <button type="submit" className="flex cursor-pointer items-center gap-1.5 py-2 pl-3 text-[12px] font-medium uppercase tracking-[0.14em] text-accent transition-colors hover:text-accent-bright">
                    {t("footer.subscribe")}
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-focus-within:translate-x-0.5 group-focus-within:-translate-y-0.5"/>
                </button>
            </div>
            {error && <p role="alert" className="animate-fade-in mt-2 text-xs text-danger">{t("footer.invalidEmail")}</p>}
        </form>
    );
};

/**
 * The colophon, in three calm bands: the house and the quote-of-the-week sign-up; the store, sections and contact
 * links; then a quiet outlined wordmark that fills with gold under the pointer, and the fine print with a way back up.
 * On phones the link columns pair up two by two and the fine print stacks under the wordmark.
 */
export const Footer = () => {
    const {t} = useTranslation();

    return (
        <footer className="relative isolate overflow-hidden border-t border-border bg-[var(--night)]">
            <div className="px-gutter relative mx-auto max-w-[1240px]">
                <Reveal className="grid gap-10 border-b border-border py-14 md:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] md:items-end md:gap-16 md:py-16">
                    <div className="space-y-5">
                        <Link to={ROUTES.HOME} className="inline-block outline-none"><Logo/></Link>
                        <p className="max-w-md font-serif text-lg leading-relaxed text-muted-foreground">{t("footer.about")}</p>
                    </div>
                    <Newsletter/>
                </Reveal>

                <Reveal variant="stagger" className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 md:grid-cols-3 md:py-14">
                    {NAV_GROUPS.map((group, groupIndex) => (
                        <nav key={group.id} aria-label={t(group.labelKey as never)} style={{"--i": groupIndex} as CSSProperties}>
                            <p className="text-[10.5px] font-medium uppercase tracking-[0.22em] text-accent">{t(group.labelKey as never)}</p>
                            <ul className="mt-5 space-y-3">
                                {group.items.map((item) => (
                                    <li key={item.to}>
                                        <Link to={item.to} className="group inline-flex items-center font-serif text-[17px] text-muted-foreground transition-colors hover:text-foreground">
                                            <span aria-hidden className="h-px w-0 bg-accent transition-[width,margin] duration-300 group-hover:mr-2 group-hover:w-4"/>
                                            {t(item.labelKey as never)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    ))}
                    <div className="col-span-2 md:col-span-1" style={{"--i": 2} as CSSProperties}>
                        <p className="text-[10.5px] font-medium uppercase tracking-[0.22em] text-accent">{t("footer.contact")}</p>
                        <ul className="mt-5 space-y-3.5 text-sm text-muted-foreground">
                            <li className="flex gap-3"><MapPin className="mt-0.5 size-4 shrink-0 stroke-[1.4] text-accent"/>{t("footer.address")}</li>
                            <li className="flex gap-3"><Clock className="mt-0.5 size-4 shrink-0 stroke-[1.4] text-accent"/>{t("footer.hours")}</li>
                            <li className="flex gap-3"><Mail className="mt-0.5 size-4 shrink-0 stroke-[1.4] text-accent"/><span className="select-all text-foreground">hello@folio.az</span></li>
                        </ul>
                    </div>
                </Reveal>
            </div>

            <Reveal variant="fade" className="footer-wordmark relative select-none overflow-hidden border-t border-border pb-4 pt-8 text-center font-display text-[clamp(88px,20vw,280px)] font-semibold leading-[0.85]">
                {[...t("brand.name")].map((letter, index) => (
                    <span key={index} aria-hidden className="inline-block" style={{"--i": index} as CSSProperties}>{letter}</span>
                ))}
            </Reveal>

            <div className="relative border-t border-border bg-[var(--night)]">
                <div className="px-gutter mx-auto flex max-w-[1240px] flex-col gap-4 py-6 text-xs leading-relaxed text-faint-foreground sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <p>{t("footer.rights", {year: new Date().getFullYear()})} · {t("footer.delivery")} · <Link to={ROUTES.PRIVACY} className="underline-offset-4 hover:text-accent-bright hover:underline">{t("legal:privacy.link")}</Link></p>
                        <p>{t("footer.note")} {t("footer.aiNote")}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}
                        className="group inline-flex w-fit cursor-pointer items-center gap-2.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-accent-bright"
                    >
                        {t("footer.backToTop")}
                        <span className="flex size-9 items-center justify-center rounded-full border border-border-strong transition-colors group-hover:border-accent">
                            <ArrowUp className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5"/>
                        </span>
                    </button>
                </div>
            </div>
        </footer>
    );
};
