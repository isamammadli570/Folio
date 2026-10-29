import {useState, type ReactNode} from "react";
import {MutationCache, QueryCache, QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {toast} from "sonner";
import i18n from "@/i18n";

type CacheMeta = {suppressGlobalError?: boolean; onError?: (error: unknown) => void} | undefined;

const handleError = (error: unknown, meta: CacheMeta, fallbackKey: string): void => {
    if (meta?.suppressGlobalError) return;
    if (typeof meta?.onError === "function") {
        meta.onError(error);
        return;
    }
    toast.error(i18n.t(fallbackKey as never));
};

const createQueryClient = (): QueryClient =>
    new QueryClient({
        queryCache: new QueryCache({
            onError: (error, query) => handleError(error, query.meta as CacheMeta, "common:errors.load"),
        }),
        mutationCache: new MutationCache({
            onError: (error, _variables, _context, mutation) => handleError(error, mutation.meta as CacheMeta, "common:errors.generic"),
        }),
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                staleTime: 5 * 60_000,
                gcTime: 10 * 60_000,
                retry: (count, error) => {
                    const status = (error as {status?: number}).status;
                    if (status === 404) return false;
                    return count < 1;
                },
            },
        },
    });

export default function QueryProvider({children}: {children: ReactNode}) {
    const [queryClient] = useState(createQueryClient);
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
