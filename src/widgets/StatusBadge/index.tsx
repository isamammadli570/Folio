import {useTranslation} from "react-i18next";
import type {OrderStatus} from "@/api/types";
import {cn} from "@/lib/utils";

const TONE: Record<OrderStatus, string> = {
    new: "border-accent/60 bg-accent-soft text-accent-bright",
    processing: "border-border-strong bg-muted text-foreground",
    shipped: "border-border-strong bg-muted text-foreground",
    delivered: "border-success/40 bg-success-soft text-success",
    cancelled: "border-danger/40 bg-danger-soft text-danger",
};

/** An order's status as a small pill; a new order carries a pulsing dot so it is seen first. */
export const StatusBadge = ({status, className}: {status: OrderStatus; className?: string}) => {
    const {t} = useTranslation("account");
    return (
        <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11.5px] font-medium", TONE[status], className)}>
            <span className={cn("relative size-1.5 rounded-full bg-current")}>
                {status === "new" && <span className="absolute inset-0 animate-ping rounded-full bg-current [animation-duration:2s]"/>}
            </span>
            {t(`orders.status.${status}`)}
        </span>
    );
};
