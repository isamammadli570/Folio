import i18n, {type BackendModule} from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import {initReactI18next} from "react-i18next";
import {BUNDLED_RESOURCES, loadNamespace, STORE_NAMESPACES, SUPPORTED_LANGUAGES} from "@/i18n/resources";
import {STORAGE_KEYS} from "@/constants/other";

/** Fetches a language/namespace pair that is not in the main bundle. */
const lazyBackend: BackendModule = {
    type: "backend",
    init: () => undefined,
    read: (language, namespace, callback) => {
        loadNamespace(language, namespace).then((data) => callback(null, data), (error: Error) => callback(error, false));
    },
};

/**
 * Resolves once the reader's language can be shown. For Azerbaijani that is at once (it is bundled); English and
 * Russian wait for their files, so the first paint never flashes untranslated keys.
 */
export const i18nReady = i18n
    .use(LanguageDetector)
    .use(lazyBackend)
    .use(initReactI18next)
    .init({
        resources: BUNDLED_RESOURCES,
        partialBundledLanguages: true,
        ns: STORE_NAMESPACES,
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
    })
    .then(() => undefined, () => undefined);

export default i18n;
