import {isRouteErrorResponse, Link, useRouteError} from "react-router";
import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button";
import {ROUTES} from "@/constants/routes";
import {ApiError} from "@/api/client";
import {Page} from "@/widgets/Page";

/**
 * The 404 and crash page, with Socrates' line about knowing nothing. Unknown URLs land here (no error thrown), as do
 * pages that fail to load.
 */
export const RouteErrorPage = () => {
    const {t} = useTranslation();
    const error = useRouteError();
    const isNotFound = error == null || (isRouteErrorResponse(error) && error.status === 404) || (error instanceof ApiError && error.status === 404);

    return (
        <Page className="flex min-h-[70dvh] flex-col items-center justify-center gap-8 text-center">
            <span className="hatched font-display text-[clamp(120px,22vw,220px)] font-semibold italic leading-none">{isNotFound ? "404" : "!"}</span>
            <figure className="-mt-6 max-w-xl">
                <blockquote className="font-serif text-[clamp(24px,3vw,32px)] italic leading-snug">«{t("notFound.quote")}»</blockquote>
                <figcaption className="mt-3 text-[11px] uppercase tracking-[0.24em] text-accent">{t("notFound.cite")}</figcaption>
            </figure>
            <div className="space-y-2">
                <h1 className="text-lg font-medium">{isNotFound ? t("notFound.title") : t("errors.generic")}</h1>
                {isNotFound && <p className="max-w-md text-sm text-muted-foreground">{t("notFound.description")}</p>}
            </div>
            <div className="flex flex-wrap justify-center gap-3">
                <Button asChild variant="outline" size="lg"><Link to={ROUTES.HOME}>{t("notFound.home")}</Link></Button>
                <Button asChild variant="accent" size="lg"><Link to={ROUTES.CATALOG}>{t("notFound.catalog")}</Link></Button>
            </div>
        </Page>
    );
};
