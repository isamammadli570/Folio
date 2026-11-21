import type {ComponentProps} from "react";
import {Tooltip as TooltipPrimitive} from "radix-ui";
import {cn} from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

/** Brings its own provider, so the tooltip code loads only with the screens that use it (not with every page). */
function Tooltip(props: ComponentProps<typeof TooltipPrimitive.Root>) {
    return (
        <TooltipPrimitive.Provider delayDuration={300}>
            <TooltipPrimitive.Root {...props}/>
        </TooltipPrimitive.Provider>
    );
}

const TooltipTrigger = TooltipPrimitive.Trigger;

function TooltipContent({className, sideOffset = 6, ...props}: ComponentProps<typeof TooltipPrimitive.Content>) {
    return (
        <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
                sideOffset={sideOffset}
                className={cn("z-50 rounded-md bg-primary px-2.5 py-1.5 text-xs text-primary-foreground data-[state=delayed-open]:animate-fade-in", className)}
                {...props}
            />
        </TooltipPrimitive.Portal>
    );
}

export {Tooltip, TooltipTrigger, TooltipContent, TooltipProvider};
