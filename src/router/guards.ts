import {redirect, type LoaderFunctionArgs} from "react-router";
import {getCurrentUser} from "@/hooks/useAuth";
import {ROUTES, safeNext} from "@/constants/routes";

/** Account pages: a guest is sent to sign in, and comes back here afterwards. */
export const requireUser = async ({request}: LoaderFunctionArgs) => {
    if (await getCurrentUser()) return null;
    const {pathname, search} = new URL(request.url);
    throw redirect(`${ROUTES.LOGIN}?next=${encodeURIComponent(pathname + search)}`);
};

/** Sign-in and sign-up pages: someone already signed in goes straight on. */
export const requireGuest = async ({request}: LoaderFunctionArgs) => {
    if (!(await getCurrentUser())) return null;
    throw redirect(safeNext(new URL(request.url).searchParams.get("next")));
};
