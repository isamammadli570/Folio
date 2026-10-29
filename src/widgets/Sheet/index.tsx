import type {ReactNode} from "react";
import {Dialog as DialogPrimitive} from "radix-ui";
import {cn} from "@/lib/utils";

type SheetProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    side?: "left" | "right";
    className?: string;
    children: ReactNode;
};

/** An edge drawer over a dimmed, blurred page: the mobile navigation (left) and the cart (right). */
export const Sheet = ({open, onOpenChange, title, side = "left", className, children}: SheetProps) => (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
        <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[3px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-fade-in"/>
            <DialogPrimitive.Content
                className={cn(
                    "fixed inset-y-0 z-50 flex w-[min(26rem,100%)] flex-col overflow-hidden bg-sidebar shadow-2xl outline-none",
                    "pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]",
                    side === "left"
                        ? "left-0 max-w-[88vw] border-r border-sidebar-border pl-[env(safe-area-inset-left)] data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:animate-slide-in-left"
                        : "right-0 border-l border-sidebar-border pr-[env(safe-area-inset-right)] data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:animate-slide-in-right",
                    className,
                )}
            >
                <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
                <DialogPrimitive.Description className="sr-only">{title}</DialogPrimitive.Description>
                {children}
            </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
);
