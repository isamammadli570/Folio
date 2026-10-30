import {useLocation, useNavigate} from "react-router";
import {toast} from "sonner";
import {useAuth} from "@/hooks/useAuth";
import {ROUTES} from "@/constants/routes";
import {STORAGE_KEYS} from "@/constants/other";
import {storageGet, storageSet} from "@/lib/localStorage";
import i18n from "@/i18n";

/**
 * Gentle reminders that an account keeps the shelf on every device. Guests can still do everything; the favourite hint
 * appears once per browser, never on every click.
 */
export const useSignInNudge = () => {
    const {user} = useAuth();
    const navigate = useNavigate();
    const {pathname, search} = useLocation();
    const loginPath = `${ROUTES.LOGIN}?next=${encodeURIComponent(pathname + search)}`;

    /** Shows the one-time guest hint; true when it was shown, so the caller can skip its own toast. */
    const afterFavorite = (): boolean => {
        if (user || storageGet(STORAGE_KEYS.FAVORITE_HINT)) return false;
        storageSet(STORAGE_KEYS.FAVORITE_HINT, "1");
        toast(i18n.t("common:nudge.favoriteTitle"), {
            description: i18n.t("common:nudge.favoriteText"),
            duration: 7000,
            action: {label: i18n.t("common:nudge.signIn"), onClick: () => navigate(loginPath)},
        });
        return true;
    };

    return {isGuest: !user, loginPath, afterFavorite};
};
