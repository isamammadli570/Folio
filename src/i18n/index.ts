import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import {initReactI18next} from "react-i18next";
import {NAMESPACES, RESOURCES, SUPPORTED_LANGUAGES} from "@/i18n/resources";
import {STORAGE_KEYS} from "@/constants/other";

void i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: RESOURCES,
        ns: NAMESPACES,
        defaultNS: "common",
        fallbackLng: "az",
        supportedLngs: SUPPORTED_LANGUAGES,
        load: "languageOnly",
        nonExplicitSupportedLngs: true,
        interpolation: {escapeValue: false},
        detection: {
            // Azerbaijani is the house language: a visitor gets it until they pick another one, which is then remembered.
            order: ["localStorage"],
            lookupLocalStorage: STORAGE_KEYS.LANGUAGE,
            caches: ["localStorage"],
        },
        react: {useSuspense: false},
    });

export default i18n;
