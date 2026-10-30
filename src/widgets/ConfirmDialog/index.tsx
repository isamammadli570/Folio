import type {ReactNode} from "react";
import {AlertDialog as AlertDialogPrimitive} from "radix-ui";
import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button";

type ConfirmDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: ReactNode;
    confirmLabel: string;
    isPending?: boolean;
    onConfirm: () => void;
};

/** Asks before a destructive action. The dialog stays open while the action runs and closes only when told to. */
export const ConfirmDialog = ({open, onOpenChange, title, description, confirmLabel, isPending = false, onConfirm}: ConfirmDialogProps) => {
    const {t} = useTranslation("admin");
    return (
        <AlertDialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
            <AlertDialogPrimitive.Portal>
                <AlertDialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[3px] data-[state=open]:animate-fade-in"/>
                <AlertDialogPrimitive.Content className="animate-scale-in fixed left-1/2 top-1/2 z-50 w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-surface-raised p-6 shadow-2xl outline-none">
                    <AlertDialogPrimitive.Title className="font-serif text-2xl">{title}</AlertDialogPrimitive.Title>
                    <AlertDialogPrimitive.Description className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</AlertDialogPrimitive.Description>
                    <div className="mt-6 flex justify-end gap-2">
                        <AlertDialogPrimitive.Cancel asChild><Button variant="ghost">{t("actions.cancel")}</Button></AlertDialogPrimitive.Cancel>
                        <Button variant="danger" loading={isPending} onClick={onConfirm}>{confirmLabel}</Button>
                    </div>
                </AlertDialogPrimitive.Content>
            </AlertDialogPrimitive.Portal>
        </AlertDialogPrimitive.Root>
    );
};
