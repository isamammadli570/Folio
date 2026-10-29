import type {ComponentProps} from "react";
import {cn} from "@/lib/utils";
import {controlStyles} from "@/components/ui/input";

function Textarea({className, ...props}: ComponentProps<"textarea">) {
    return <textarea data-slot="textarea" className={cn(controlStyles, "min-h-20 resize-y py-2.5", className)} {...props}/>;
}

export {Textarea};
