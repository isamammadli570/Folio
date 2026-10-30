import {Toaster as Sonner, type ToasterProps} from "sonner";
import {useTheme} from "@/hooks/useTheme";

/** The site's toasts: a soft card at the bottom centre that follows the theme, with the accent on its action button. */
function Toaster(props: ToasterProps) {
    const {theme} = useTheme();
    return (
        <Sonner
            theme={theme}
            position="bottom-center"
            offset={24}
            mobileOffset={16}
            visibleToasts={3}
            toastOptions={{
                classNames: {
                    toast: "!rounded-2xl !border !border-border-strong !bg-surface-raised !text-foreground !shadow-[0_18px_40px_-12px_rgb(var(--shade)/0.55)] !text-[13.5px] !px-5 !py-3.5 !gap-3",
                    title: "!font-medium",
                    description: "!text-muted-foreground !text-[12.5px] !leading-relaxed",
                    actionButton: "!rounded-full !bg-accent !text-accent-ink !font-medium !px-3.5 !h-8",
                    cancelButton: "!rounded-full !bg-muted !text-foreground",
                    icon: "!text-accent-bright",
                    success: "[&_[data-icon]]:!text-success",
                    error: "[&_[data-icon]]:!text-danger",
                },
            }}
            {...props}
        />
    );
}

export {Toaster};
