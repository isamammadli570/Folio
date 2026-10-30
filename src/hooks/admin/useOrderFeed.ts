import {useEffect} from "react";
import {useNavigate} from "react-router";
import {useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {supabase} from "@/api/supabase";
import {QUERY_KEYS} from "@/constants/other";
import {ROUTES} from "@/constants/routes";
import {formatPrice} from "@/helpers/format";
import {useLanguage} from "@/hooks/useLanguage";
import i18n from "@/i18n";

type NewOrder = {number: string; first_name: string; total: number | string};

/**
 * While the admin panel is open, new orders arrive by Supabase Realtime: a toast names the order and the lists and
 * dashboard refresh. Row-level security still applies, so only admins receive the rows.
 */
export const useOrderFeed = (enabled: boolean) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const {language} = useLanguage();

    useEffect(() => {
        if (!enabled) return;
        const channel = supabase
            .channel("admin-orders")
            .on("postgres_changes", {event: "INSERT", schema: "public", table: "orders"}, ({new: order}) => {
                const row = order as NewOrder;
                void queryClient.invalidateQueries({queryKey: [QUERY_KEYS.ADMIN_ORDERS]});
                void queryClient.invalidateQueries({queryKey: [QUERY_KEYS.ADMIN_CUSTOMERS]});
                toast.success(i18n.t("admin:orders.incoming", {number: row.number, name: row.first_name, total: formatPrice(Number(row.total), language)}), {
                    action: {label: i18n.t("admin:orders.open"), onClick: () => navigate(ROUTES.ADMIN_ORDERS)},
                });
            })
            .subscribe();
        return () => void supabase.removeChannel(channel);
    }, [enabled, queryClient, navigate, language]);
};
