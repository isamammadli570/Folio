import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {deleteAddress, getAddresses, getProfile, saveAddress, updateProfile, type AddressInput} from "@/api/account.api";
import {getMyOrders, placeOrder} from "@/api/orders.api";
import {signOut} from "@/api/auth.api";
import type {Profile} from "@/api/types";
import {QUERY_KEYS} from "@/constants/other";
import {useAuth} from "@/hooks/useAuth";
import {cartActions} from "@/hooks/useCart";
import {favoriteActions} from "@/hooks/useFavorites";
import {queryErrorMeta} from "@/hooks/_shared/queryErrorMeta";
import i18n from "@/i18n";

const ACCOUNT_KEYS = [QUERY_KEYS.ORDERS, QUERY_KEYS.PROFILE, QUERY_KEYS.ADDRESSES];

export const useGetOrders = () => {
    const {user} = useAuth();
    const query = useQuery({
        queryKey: [QUERY_KEYS.ORDERS, user?.id],
        queryFn: getMyOrders,
        enabled: Boolean(user),
        staleTime: 30_000,
        meta: queryErrorMeta(),
    });
    return {...query, items: query.data ?? []};
};

export const useGetProfile = () => {
    const {user} = useAuth();
    return useQuery({
        queryKey: [QUERY_KEYS.PROFILE, user?.id],
        queryFn: () => getProfile(user?.id ?? ""),
        enabled: Boolean(user),
        meta: queryErrorMeta(),
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (profile: Profile) => updateProfile(profile),
        onSuccess: (profile) => {
            queryClient.setQueryData([QUERY_KEYS.PROFILE, profile.id], profile);
            toast.success(i18n.t("account:profile.saved"));
        },
    });
};

export const useGetAddresses = () => {
    const {user} = useAuth();
    const query = useQuery({
        queryKey: [QUERY_KEYS.ADDRESSES, user?.id],
        queryFn: getAddresses,
        enabled: Boolean(user),
        meta: queryErrorMeta(),
    });
    return {...query, items: query.data ?? []};
};

export const useSaveAddress = () => {
    const {user} = useAuth();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({input, addressId}: {input: AddressInput; addressId?: string}) => saveAddress(user?.id ?? "", input, addressId),
        onSuccess: () => {
            void queryClient.invalidateQueries({queryKey: [QUERY_KEYS.ADDRESSES]});
            toast.success(i18n.t("account:addresses.saved"));
        },
    });
};

export const useDeleteAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteAddress,
        onSuccess: () => {
            void queryClient.invalidateQueries({queryKey: [QUERY_KEYS.ADDRESSES]});
            toast.success(i18n.t("account:addresses.deleted"));
        },
    });
};

/** Errors are shown by the checkout itself, which knows which book ran out. */
export const usePlaceOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: placeOrder,
        meta: {suppressGlobalError: true},
        onSuccess: () => {
            void queryClient.invalidateQueries({queryKey: [QUERY_KEYS.ORDERS]});
            void queryClient.invalidateQueries({queryKey: [QUERY_KEYS.BOOKS]});
            void queryClient.invalidateQueries({queryKey: [QUERY_KEYS.BOOK]});
        },
    });
};

/** Signing out also empties this device's cart and favourites: they belong to the account now. */
export const useSignOut = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: signOut,
        onSuccess: () => {
            cartActions.clear();
            favoriteActions.replace([]);
            ACCOUNT_KEYS.forEach((key) => queryClient.removeQueries({queryKey: [key]}));
            toast.success(i18n.t("account:nav.signedOut"));
        },
    });
};
