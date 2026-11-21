import type {ComponentProps} from "react";
import {UserRound} from "lucide-react";
import {useTranslation} from "react-i18next";
import {useAuth} from "@/hooks/useAuth";
import {userIdentity} from "@/helpers/user";
import {cn} from "@/lib/utils";
import {UserAvatar} from "@/widgets/UserAvatar";

/**
 * The round account button in the header: the reader's initials when signed in, a person icon for a guest. The menu
 * it opens (AccountMenu) is a separate chunk; until it arrives this same button stands in its place.
 */
export const AccountButton = ({className, ...props}: ComponentProps<"button">) => {
    const {t} = useTranslation();
    const {user} = useAuth();
    return (
        <button type="button" aria-label={t(user ? "header.account" : "header.signIn")} className={cn(className, user && "border-accent/60 data-[state=open]:border-accent data-[state=open]:bg-accent-soft")} {...props}>
            {user ? <UserAvatar identity={userIdentity(user)} className="size-full border-0 text-[15px]"/> : <UserRound/>}
            {user && <span aria-hidden className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-background bg-accent"/>}
        </button>
    );
};
