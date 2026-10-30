import {useEffect} from "react";
import {toast} from "sonner";
import {supabase} from "@/api/supabase";
import {OAUTH_PENDING_KEY} from "@/constants/other";
import {userIdentity} from "@/helpers/user";
import i18n from "@/i18n";

const CONNECTION_TOAST = "connection";

/**
 * Toasts for things that happen outside any one page: the connection dropping and coming back (one toast that changes
 * in place), and the welcome after returning from Google, which leaves the site and so cannot greet on its own page.
 * Renders nothing.
 */
export const AppSignals = () => {
    useEffect(() => {
        const offline = () => toast.error(i18n.t("common:toasts.offline"), {id: CONNECTION_TOAST, duration: Infinity});
        const online = () => toast.success(i18n.t("common:toasts.online"), {id: CONNECTION_TOAST, duration: 3000});
        window.addEventListener("offline", offline);
        window.addEventListener("online", online);

        const {data} = supabase.auth.onAuthStateChange((event, session) => {
            // The session from Google may already be in place when this listener attaches (INITIAL_SESSION) or arrive just after (SIGNED_IN).
            if ((event !== "SIGNED_IN" && event !== "INITIAL_SESSION") || !session) return;
            try {
                if (!sessionStorage.getItem(OAUTH_PENDING_KEY)) return;
                sessionStorage.removeItem(OAUTH_PENDING_KEY);
            } catch {
                return;
            }
            const name = userIdentity(session.user).name.split(" ")[0];
            // Let the page the reader returns to paint first.
            window.setTimeout(() => toast.success(i18n.t("account:auth.login.welcome", {name})), 400);
        });

        return () => {
            window.removeEventListener("offline", offline);
            window.removeEventListener("online", online);
            data.subscription.unsubscribe();
        };
    }, []);

    return null;
};
