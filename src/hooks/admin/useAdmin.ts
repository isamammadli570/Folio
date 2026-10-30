import {useMutation, useQuery, useQueryClient, type QueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {
    deleteAuthor,
    deleteBook,
    getAllOrders,
    getCustomerCount,
    getCustomers,
    getMyRole,
    saveAuthor,
    saveBook,
    updateOrderStatus,
    uploadMedia,
    type MediaFolder,
} from "@/api/admin.api";
import type {Author, Book} from "@/api/types";
import {getSubscribers, removeSubscriber} from "@/api/newsletter.api";
import {getStockAlerts, removeStockAlert} from "@/api/alerts.api";
import {createPromoCode, deletePromoCode, getPromoCodes, setPromoActive} from "@/api/promos.api";
import {QUERY_KEYS} from "@/constants/other";
import {useAuth} from "@/hooks/useAuth";
import {queryErrorMeta} from "@/hooks/_shared/queryErrorMeta";
import i18n from "@/i18n";

/** Every catalogue view reads the same cache, so an edit refreshes all of them. */
const refreshCatalogue = (queryClient: QueryClient) =>
    [QUERY_KEYS.BOOKS, QUERY_KEYS.BOOK, QUERY_KEYS.AUTHORS, QUERY_KEYS.AUTHOR, QUERY_KEYS.CATEGORY_COUNTS]
        .forEach((key) => void queryClient.invalidateQueries({queryKey: [key]}));

/** Translates a failed save: a duplicate id and a still-referenced row get their own messages. */
const saveError = (error: unknown) => {
    const message = error instanceof Error ? error.message : "";
    if (message === "DUPLICATE_ID") return i18n.t("admin:errors.duplicateId");
    if (/foreign key|violates/i.test(message)) return i18n.t("admin:errors.inUse");
    return i18n.t("admin:errors.save");
};

const onError = {meta: {onError: (error: unknown) => toast.error(saveError(error))}};

/** Whether the signed-in reader is an admin; false for guests and customers. */
export const useIsAdmin = () => {
    const {user} = useAuth();
    const query = useQuery({queryKey: [QUERY_KEYS.ROLE, user?.id], queryFn: getMyRole, enabled: Boolean(user), staleTime: 5 * 60_000, meta: {suppressGlobalError: true}});
    return {isAdmin: query.data === "admin", isLoading: query.isLoading};
};

export const useGetAllOrders = () => {
    const query = useQuery({queryKey: [QUERY_KEYS.ADMIN_ORDERS], queryFn: getAllOrders, staleTime: 15_000, meta: queryErrorMeta()});
    return {...query, items: query.data ?? []};
};

export const useGetCustomerCount = () =>
    useQuery({queryKey: [QUERY_KEYS.CUSTOMERS], queryFn: getCustomerCount, meta: {suppressGlobalError: true}});

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateOrderStatus,
        ...onError,
        onSuccess: () => {
            void queryClient.invalidateQueries({queryKey: [QUERY_KEYS.ADMIN_ORDERS]});
            void queryClient.invalidateQueries({queryKey: [QUERY_KEYS.ORDERS]});
            toast.success(i18n.t("admin:orders.statusSaved"));
        },
    });
};

export const useSaveBook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({book, isNew}: {book: Book; isNew: boolean}) => saveBook(book, isNew),
        ...onError,
        onSuccess: () => {
            refreshCatalogue(queryClient);
            toast.success(i18n.t("admin:books.saved"));
        },
    });
};

export const useDeleteBook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteBook,
        ...onError,
        onSuccess: () => {
            refreshCatalogue(queryClient);
            toast.success(i18n.t("admin:books.deleted"));
        },
    });
};

export const useSaveAuthor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({author, isNew}: {author: Author; isNew: boolean}) => saveAuthor(author, isNew),
        ...onError,
        onSuccess: () => {
            refreshCatalogue(queryClient);
            toast.success(i18n.t("admin:authors.saved"));
        },
    });
};

export const useDeleteAuthor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteAuthor,
        ...onError,
        onSuccess: () => {
            refreshCatalogue(queryClient);
            toast.success(i18n.t("admin:authors.deleted"));
        },
    });
};

export const useUploadMedia = () =>
    useMutation({
        mutationFn: ({file, folder, name}: {file: File; folder: MediaFolder; name: string}) => uploadMedia(file, folder, name),
        meta: {onError: () => toast.error(i18n.t("admin:errors.upload"))},
    });

export const useGetSubscribers = () => {
    const query = useQuery({queryKey: [QUERY_KEYS.SUBSCRIBERS], queryFn: getSubscribers, meta: queryErrorMeta()});
    return {...query, items: query.data ?? []};
};

export const useRemoveSubscriber = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: removeSubscriber,
        ...onError,
        onSuccess: () => {
            void queryClient.invalidateQueries({queryKey: [QUERY_KEYS.SUBSCRIBERS]});
            toast.success(i18n.t("admin:newsletter.removed"));
        },
    });
};

export const useGetCustomers = () => {
    const query = useQuery({queryKey: [QUERY_KEYS.ADMIN_CUSTOMERS], queryFn: getCustomers, meta: queryErrorMeta()});
    return {...query, items: query.data ?? []};
};

export const useGetPromoCodes = () => {
    const query = useQuery({queryKey: [QUERY_KEYS.PROMO_CODES], queryFn: getPromoCodes, meta: queryErrorMeta()});
    return {...query, items: query.data ?? []};
};

export const useCreatePromoCode = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPromoCode,
        meta: {onError: (error: unknown) => toast.error(i18n.t(error instanceof Error && error.message === "DUPLICATE_ID" ? "admin:promos.taken" : "admin:errors.save"))},
        onSuccess: () => {
            void queryClient.invalidateQueries({queryKey: [QUERY_KEYS.PROMO_CODES]});
            toast.success(i18n.t("admin:promos.created"));
        },
    });
};

export const useSetPromoActive = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: setPromoActive,
        ...onError,
        onSuccess: () => void queryClient.invalidateQueries({queryKey: [QUERY_KEYS.PROMO_CODES]}),
    });
};

export const useDeletePromoCode = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deletePromoCode,
        ...onError,
        onSuccess: () => {
            void queryClient.invalidateQueries({queryKey: [QUERY_KEYS.PROMO_CODES]});
            toast.success(i18n.t("admin:promos.deleted"));
        },
    });
};

export const useGetStockAlerts = () => {
    const query = useQuery({queryKey: [QUERY_KEYS.STOCK_ALERTS], queryFn: getStockAlerts, meta: queryErrorMeta()});
    return {...query, items: query.data ?? []};
};

export const useRemoveStockAlert = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: removeStockAlert,
        ...onError,
        onSuccess: () => {
            void queryClient.invalidateQueries({queryKey: [QUERY_KEYS.STOCK_ALERTS]});
            toast.success(i18n.t("admin:alerts.removed"));
        },
    });
};
