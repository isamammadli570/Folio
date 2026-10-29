import {useCallback} from "react";
import {useTranslation} from "react-i18next";
import type {Localized} from "@/api/types";
import {isLanguage, type Language} from "@/i18n/resources";

/** The current site language, and a picker for values stored in all three languages. */
export const useLanguage = () => {
    const {i18n} = useTranslation();
    const resolved = (i18n.resolvedLanguage ?? i18n.language ?? "az").split("-")[0];
    const language: Language = isLanguage(resolved) ? resolved : "az";
    const pick = useCallback((value: Localized) => value[language] || value.az, [language]);
    return {language, pick};
};
