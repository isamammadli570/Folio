import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {canReview, deleteReview, getRatings, getReviews, saveReview} from "@/api/reviews.api";
import {requestStockAlert} from "@/api/alerts.api";
import {QUERY_KEYS} from "@/constants/other";
import {useAuth} from "@/hooks/useAuth";
import {queryErrorMeta} from "@/hooks/_shared/queryErrorMeta";
import i18n from "@/i18n";

export const useGetReviews = (bookId: string | undefined) => {
    const query = useQuery({queryKey: [QUERY_KEYS.REVIEWS, bookId], queryFn: () => getReviews(bookId ?? ""), enabled: Boolean(bookId), meta: queryErrorMeta()});
    return {...query, items: query.data ?? []};
};

/** Stars for every book; fails quietly (a card without stars is still a card). */
export const useGetRatings = () =>
    useQuery({queryKey: [QUERY_KEYS.RATINGS], queryFn: getRatings, staleTime: 5 * 60_000, meta: {suppressGlobalError: true}});

export const useCanReview = (bookId: string | undefined) => {
    const {user} = useAuth();
    return useQuery({
        queryKey: [QUERY_KEYS.CAN_REVIEW, bookId, user?.id],
        queryFn: () => canReview(bookId ?? ""),
        enabled: Boolean(bookId && user),
        meta: {suppressGlobalError: true},
    });
};

export const useSaveReview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: saveReview,
        meta: {onError: () => toast.error(i18n.t("catalog:reviews.saveFailed"))},
        onSuccess: (_result, {bookId}) => {
            void queryClient.invalidateQueries({queryKey: [QUERY_KEYS.REVIEWS, bookId]});
            void queryClient.invalidateQueries({queryKey: [QUERY_KEYS.RATINGS]});
            toast.success(i18n.t("catalog:reviews.saved"));
        },
    });
};

export const useDeleteReview = (bookId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteReview,
        onSuccess: () => {
            void queryClient.invalidateQueries({queryKey: [QUERY_KEYS.REVIEWS, bookId]});
            void queryClient.invalidateQueries({queryKey: [QUERY_KEYS.RATINGS]});
            toast.success(i18n.t("catalog:reviews.deleted"));
        },
    });
};

export const useRequestStockAlert = () =>
    useMutation({
        mutationFn: requestStockAlert,
        meta: {onError: () => toast.error(i18n.t("catalog:alert.failed"))},
        onSuccess: (result) => toast.success(i18n.t(result === "exists" ? "catalog:alert.exists" : "catalog:alert.added")),
    });
