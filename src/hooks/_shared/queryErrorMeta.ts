import {toast} from "sonner";
import i18n from "@/i18n";

/** Request errors are toasted once, by the global cache handler, through this `meta.onError`. */
export const queryErrorMeta = (fallbackKey = "common:errors.load") => ({
    onError: () => {
        toast.error(i18n.t(fallbackKey as never));
    },
});
