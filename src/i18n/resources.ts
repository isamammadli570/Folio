import azCommon from "./locales/AZ/common.json";
import azHome from "./locales/AZ/home.json";
import azCatalog from "./locales/AZ/catalog.json";
import azAuthors from "./locales/AZ/authors.json";
import azCart from "./locales/AZ/cart.json";
import azAccount from "./locales/AZ/account.json";
import azAdmin from "./locales/AZ/admin.json";
import azLegal from "./locales/AZ/legal.json";
import enCommon from "./locales/EN/common.json";
import enHome from "./locales/EN/home.json";
import enCatalog from "./locales/EN/catalog.json";
import enAuthors from "./locales/EN/authors.json";
import enCart from "./locales/EN/cart.json";
import enAccount from "./locales/EN/account.json";
import enAdmin from "./locales/EN/admin.json";
import enLegal from "./locales/EN/legal.json";
import ruCommon from "./locales/RU/common.json";
import ruHome from "./locales/RU/home.json";
import ruCatalog from "./locales/RU/catalog.json";
import ruAuthors from "./locales/RU/authors.json";
import ruCart from "./locales/RU/cart.json";
import ruAccount from "./locales/RU/account.json";
import ruAdmin from "./locales/RU/admin.json";
import ruLegal from "./locales/RU/legal.json";

export const SUPPORTED_LANGUAGES = ["az", "en", "ru"] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const NAMESPACES = ["common", "home", "catalog", "authors", "cart", "account", "admin", "legal"] as const;

export const LANGUAGE_LABELS: Record<Language, string> = {az: "Azərbaycan", en: "English", ru: "Русский"};

export const isLanguage = (value: string): value is Language => (SUPPORTED_LANGUAGES as readonly string[]).includes(value);

export const RESOURCES = {
    az: {common: azCommon, home: azHome, catalog: azCatalog, authors: azAuthors, cart: azCart, account: azAccount, admin: azAdmin, legal: azLegal},
    en: {common: enCommon, home: enHome, catalog: enCatalog, authors: enAuthors, cart: enCart, account: enAccount, admin: enAdmin, legal: enLegal},
    ru: {common: ruCommon, home: ruHome, catalog: ruCatalog, authors: ruAuthors, cart: ruCart, account: ruAccount, admin: ruAdmin, legal: ruLegal},
} as const;
