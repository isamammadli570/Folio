import {useEffect} from "react";
import {useTranslation} from "react-i18next";

/**
 * The browser tab's title: "Crime and Punishment — Folio" on a page, "Folio · Book house" on the home page (or while a
 * page has nothing to name yet). Follows the language.
 */
export const useDocumentTitle = (title?: string | null) => {
    const {t} = useTranslation();
    useEffect(() => {
        const brand = t("brand.name");
        document.title = title ? `${title} — ${brand}` : `${brand} · ${t("brand.tagline")}`;
    }, [title, t]);
};
