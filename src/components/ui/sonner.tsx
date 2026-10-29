import {Toaster as Sonner, type ToasterProps} from "sonner";

function Toaster(props: ToasterProps) {
    return (
        <Sonner
            theme="dark"
            position="bottom-center"
            offset={24}
            toastOptions={{
                classNames: {
                    toast: "!rounded-full !border !border-border-strong !bg-surface-raised !text-foreground !shadow-2xl !text-[13.5px] !px-5",
                    actionButton: "!rounded-full !bg-accent !text-accent-ink !font-medium",
                    description: "!text-muted-foreground",
                },
            }}
            {...props}
        />
    );
}

export {Toaster};
