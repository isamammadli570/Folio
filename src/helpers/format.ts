import type {TFunction} from "i18next";
import type {Language} from "@/i18n/resources";

const LOCALE: Record<Language, string> = {az: "az-AZ", en: "en-GB", ru: "ru-RU"};

/** Two decimals in the language's number style; the manat sign always follows the number, as on Azerbaijani price tags. */
export const formatPrice = (amount: number, language: Language): string =>
    `${new Intl.NumberFormat(LOCALE[language], {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(amount)} ₼`;

/** A single year: "1866", "375 BC" / "e.ə. 375" / "375 до н. э.", with "c." for approximate dates. */
export const formatYear = (year: number, t: TFunction, approx = false): string => {
    const value = year < 0 ? t("common:years.bce", {year: Math.abs(year)}) : String(year);
    return approx ? t("common:years.approx", {value}) : value;
};

/** A lifespan such as "1821 — 1881" or "e.ə. 427 — 347". When both ends are BCE the era is written once, at the start. */
export const formatLifespan = (born: number, died: number, t: TFunction, approx = false): string => {
    const range = born < 0 && died < 0
        ? t("common:years.bceRange", {from: Math.abs(born), to: Math.abs(died)})
        : `${formatYear(born, t)} — ${formatYear(died, t)}`;
    return approx ? t("common:years.approx", {value: range}) : range;
};

/** Upper-cases with the language's own rules (Azerbaijani "i" → "İ"). */
export const upper = (value: string, language: Language): string => value.toLocaleUpperCase(language === "az" ? "az" : language);

/** The surname, used on book spines and covers: the last word of the name. */
export const surname = (name: string): string => name.trim().split(/\s+/).at(-1) ?? name;

/** "29 October 2026" in the site language. */
export const formatDate = (iso: string, language: Language): string =>
    new Intl.DateTimeFormat(LOCALE[language], {day: "numeric", month: "long", year: "numeric"}).format(new Date(iso));
