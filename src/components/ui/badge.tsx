import type {ComponentProps} from "react";
import {cva, type VariantProps} from "class-variance-authority";
import {cn} from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium",
    {
        variants: {
            tone: {
                neutral: "bg-muted text-muted-foreground",
                accent: "bg-accent-soft text-accent",
                success: "bg-success-soft text-success",
                danger: "bg-danger-soft text-danger",
                outline: "border border-border text-muted-foreground",
            },
        },
        defaultVariants: {tone: "neutral"},
    },
);

export type BadgeTone = NonNullable<VariantProps<typeof badgeVariants>["tone"]>;

function Badge({className, tone, ...props}: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
    return <span data-slot="badge" className={cn(badgeVariants({tone}), className)} {...props}/>;
}

export {Badge, badgeVariants};
