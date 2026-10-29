import azCommon from "./locales/AZ/common.json";
import azHome from "./locales/AZ/home.json";
import azCatalog from "./locales/AZ/catalog.json";
import azAuthors from "./locales/AZ/authors.json";
import azCart from "./locales/AZ/cart.json";
import enCommon from "./locales/EN/common.json";
import enHome from "./locales/EN/home.json";
import enCatalog from "./locales/EN/catalog.json";
import enAuthors from "./locales/EN/authors.json";
import enCart from "./locales/EN/cart.json";
import ruCommon from "./locales/RU/common.json";
import ruHome from "./locales/RU/home.json";
import ruCatalog from "./locales/RU/catalog.json";
import ruAuthors from "./locales/RU/authors.json";
import ruCart from "./locales/RU/cart.json";

export const SUPPORTED_LANGUAGES = ["az", "en", "ru"] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const NAMESPACES = ["common", "home", "catalog", "authors", "cart"] as const;

export const LANGUAGE_LABELS: Record<Language, string> = {az: "Azərbaycan", en: "English", ru: "Русский"};

export const isLanguage = (value: string): value is Language => (SUPPORTED_LANGUAGES as readonly string[]).includes(value);

export const RESOURCES = {
    az: {common: azCommon, home: azHome, catalog: azCatalog, authors: azAuthors, cart: azCart},
    en: {common: enCommon, home: enHome, catalog: enCatalog, authors: enAuthors, cart: enCart},
    ru: {common: ruCommon, home: ruHome, catalog: ruCatalog, authors: ruAuthors, cart: ruCart},
} as const;
