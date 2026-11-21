import azCommon from "./locales/AZ/common.json";
import azHome from "./locales/AZ/home.json";
import azCatalog from "./locales/AZ/catalog.json";
import azAuthors from "./locales/AZ/authors.json";
import azCart from "./locales/AZ/cart.json";
import azAccount from "./locales/AZ/account.json";
import azLegal from "./locales/AZ/legal.json";

export const SUPPORTED_LANGUAGES = ["az", "en", "ru"] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const NAMESPACES = ["common", "home", "catalog", "authors", "cart", "account", "admin", "legal"] as const;
export type Namespace = (typeof NAMESPACES)[number];

/** What the storefront needs on every page; the admin namespace is read only inside the admin panel. */
export const STORE_NAMESPACES = ["common", "home", "catalog", "authors", "cart", "account", "legal"] as const satisfies readonly Namespace[];

export const LANGUAGE_LABELS: Record<Language, string> = {az: "Azərbaycan", en: "English", ru: "Русский"};

export const isLanguage = (value: string): value is Language => (SUPPORTED_LANGUAGES as readonly string[]).includes(value);

/**
 * Azerbaijani, the house language most visitors read, ships inside the main bundle so the first page needs no extra
 * request. Every other language, and the admin texts, arrive on demand (see `loadNamespace`).
 */
export const BUNDLED_RESOURCES = {
    az: {common: azCommon, home: azHome, catalog: azCatalog, authors: azAuthors, cart: azCart, account: azAccount, legal: azLegal},
} as const;

// Each file becomes its own small chunk, fetched only when a visitor reads that language or opens the admin panel.
const LOADERS = import.meta.glob<{default: Record<string, unknown>}>([
    "./locales/*/*.json",
    "!./locales/AZ/{common,home,catalog,authors,cart,account,legal}.json",
]);

export const loadNamespace = async (language: string, namespace: string): Promise<Record<string, unknown>> => {
    const loader = LOADERS[`./locales/${language.toUpperCase()}/${namespace}.json`];
    if (!loader) throw new Error(`No translations for ${language}/${namespace}`);
    return (await loader()).default;
};
