import type {ComponentProps} from "react";
import {cva, type VariantProps} from "class-variance-authority";
import {Slot} from "radix-ui";
import {Loader2} from "lucide-react";
import {cn} from "@/lib/utils";

const buttonVariants = cva(
    "relative inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap rounded-sm border border-transparent text-sm font-medium outline-none transition-[background-color,border-color,color,transform,opacity] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    {
        variants: {
            variant: {
                primary: "bg-primary text-primary-foreground hover:bg-primary/85",
                secondary: "bg-muted text-foreground hover:bg-border",
                outline: "border-border bg-surface text-foreground hover:border-border-strong hover:bg-muted",
                ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
                accent: "overflow-hidden bg-accent text-accent-ink hover:bg-accent-bright before:pointer-events-none before:absolute before:inset-0 before:-translate-x-full before:skew-x-[-20deg] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:transition-transform before:duration-700 hover:before:translate-x-full",
                "destructive-ghost": "text-muted-foreground hover:bg-danger-soft hover:text-danger",
                link: "h-auto rounded-none p-0 text-foreground underline-offset-4 hover:underline",
            },
            size: {
                xs: "h-7 px-2.5 text-xs",
                sm: "h-8 px-3",
                md: "h-10 px-4",
                lg: "h-12 px-6 text-[14px]",
                icon: "size-9",
                "icon-sm": "size-8",
            },
        },
        defaultVariants: {variant: "primary", size: "md"},
    },
);

type ButtonProps = ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
        loading?: boolean;
    };

function Button({className, variant, size, asChild = false, loading = false, disabled, children, ...props}: ButtonProps) {
    const Comp = asChild ? Slot.Root : "button";

    return (
        <Comp
            data-slot="button"
            className={cn(buttonVariants({variant, size}), className)}
            disabled={disabled || loading}
            aria-busy={loading || undefined}
            {...props}
        >
            {asChild ? (
                children
            ) : (
                <>
                    {loading && <Loader2 className="animate-spin" aria-hidden/>}
                    {children}
                </>
            )}
        </Comp>
    );
}

export {Button, buttonVariants};
