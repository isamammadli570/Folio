import type {ComponentProps} from "react";
import {cn} from "@/lib/utils";

export const controlStyles =
    "w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground/70 hover:border-border-strong focus:border-foreground focus:ring-2 focus:ring-ring/10 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60 aria-invalid:border-danger aria-invalid:focus:ring-danger/15";

function Input({className, type = "text", ...props}: ComponentProps<"input">) {
    return <input type={type} data-slot="input" className={cn(controlStyles, "h-10", className)} {...props}/>;
}

export {Input};
