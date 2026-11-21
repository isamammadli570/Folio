import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {RouterProvider} from "react-router";
import "@/index.css";
import i18n, {i18nReady} from "@/i18n";
import {getCatalogue} from "@/api/client";
import {getRatings} from "@/api/reviews.api";
import {QUERY_KEYS} from "@/constants/other";
import QueryProvider, {queryClient} from "@/provider/QueryProvider";
import {ErrorBoundary} from "@/widgets/ErrorBoundary";
import {Toaster} from "@/components/ui/sonner";
import {router} from "@/router";
import {AppSignals} from "@/widgets/AppSignals";

// Ask for the catalogue and the star ratings now, while the page's own code is still downloading, instead of after
// the first render. The queries pick up the same requests.
void getCatalogue();
void queryClient.prefetchQuery({queryKey: [QUERY_KEYS.RATINGS], queryFn: getRatings, staleTime: 5 * 60_000});

const syncDocumentLanguage = (language: string): void => {
    document.documentElement.lang = language.split("-")[0];
};

i18n.on("languageChanged", syncDocumentLanguage);

// Azerbaijani is bundled, so this is immediate; English and Russian wait for their (small) files.
void i18nReady.then(() => {
    syncDocumentLanguage(i18n.resolvedLanguage ?? i18n.language);
    createRoot(document.getElementById("root") as HTMLElement).render(
        <StrictMode>
            <ErrorBoundary>
                <QueryProvider>
                    <RouterProvider router={router}/>
                    <Toaster/>
                    <AppSignals/>
                </QueryProvider>
            </ErrorBoundary>
        </StrictMode>,
    );
});
