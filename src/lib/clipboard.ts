import {toast} from "sonner";
import i18n from "@/i18n";

/** Copies text and says so in a toast; when the browser refuses (no permission, old browser) says that instead. */
export const copyText = async (text: string, successKey = "common:toasts.copied") => {
    try {
        await navigator.clipboard.writeText(text);
        toast.success(i18n.t(successKey as never));
    } catch {
        toast.error(i18n.t("common:toasts.copyFailed"));
    }
};
