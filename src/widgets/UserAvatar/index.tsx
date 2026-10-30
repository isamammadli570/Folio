import {useState} from "react";
import type {UserIdentity} from "@/helpers/user";
import {cn} from "@/lib/utils";

type UserAvatarProps = {
    identity: UserIdentity;
    className?: string;
};

/** The reader's Google photo in a gilt ring, or their initials in serif when there is no photo (or it fails to load). */
export const UserAvatar = ({identity, className}: UserAvatarProps) => {
    const [failed, setFailed] = useState(false);
    const showPhoto = Boolean(identity.avatar) && !failed;

    return (
        <span className={cn("relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-accent/60 font-serif text-accent-bright", className)}>
            {showPhoto ? (
                <img src={identity.avatar} alt="" referrerPolicy="no-referrer" onError={() => setFailed(true)} className="size-full object-cover"/>
            ) : (
                <>
                    <span aria-hidden className="absolute inset-1 rounded-full border border-accent/20"/>
                    {identity.initials}
                </>
            )}
        </span>
    );
};
