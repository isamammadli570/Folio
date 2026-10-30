import type {CSSProperties} from "react";
import {useTranslation} from "react-i18next";
import {CONTACT_EMAIL} from "@/constants/other";
import {formatDate} from "@/helpers/format";
import {useDocumentTitle} from "@/hooks/useDocumentTitle";
import {useLanguage} from "@/hooks/useLanguage";
import {OrnamentDivider} from "@/widgets/OrnamentDivider";
import {Page} from "@/widgets/Page";
import {PageTitle} from "@/widgets/PageTitle";

type Section = {title: string; items: string[]};

type LegalDocumentProps = {
    /** Top-level key in the `legal` namespace: eyebrow, title, intro, sections and contact live under it. */
    doc: "privacy" | "terms";
    /** When the text last changed (ISO date). */
    updated: string;
};

/** A legal page in the shop's book typography: numbered sections with diamond bullets and a contact line. */
export const LegalDocument = ({doc, updated}: LegalDocumentProps) => {
    const {t} = useTranslation("legal");
    const {language} = useLanguage();
    const sections = t(`${doc}.sections`, {returnObjects: true, email: CONTACT_EMAIL}) as Section[];
    useDocumentTitle(t(`${doc}.title`));

    return (
        <Page className="max-w-[820px]">
            <PageTitle eyebrow={t(`${doc}.eyebrow`)} title={t(`${doc}.title`)} description={t(`${doc}.intro`)}/>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-accent">{t("updated", {date: formatDate(updated, language)})}</p>
            <OrnamentDivider className="my-10"/>
            <div className="flex flex-col gap-10">
                {sections.map((section, index) => (
                    <section key={section.title} className="animate-fade-up" style={{animationDelay: `${index * 60}ms`} as CSSProperties}>
                        <h2 className="flex items-baseline gap-3 font-serif text-[26px] leading-tight">
                            <span className="tabular font-display text-lg text-accent">{String(index + 1).padStart(2, "0")}</span>
                            {section.title}
                        </h2>
                        <ul className="mt-4 flex flex-col gap-2.5 pl-9">
                            {section.items.map((item) => (
                                <li key={item} className="relative text-[15.5px] leading-relaxed text-muted-foreground before:absolute before:-left-5 before:top-[0.7em] before:size-1.5 before:rotate-45 before:border before:border-accent/70">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>
            <p className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">
                {t("contact", {email: ""})}<a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:text-accent-bright">{CONTACT_EMAIL}</a>
            </p>
        </Page>
    );
};
