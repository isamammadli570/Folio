import {cn} from "@/lib/utils";

type OrnamentDividerProps = {
    className?: string;
};

/** A hairline with a small diamond in the middle, the same diamond as on the covers. */
export const OrnamentDivider = ({className}: OrnamentDividerProps) => (
    <div aria-hidden className={cn("flex items-center gap-3", className)}>
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-border-strong"/>
        <span className="size-1.5 rotate-45 border border-accent/70"/>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-border-strong"/>
    </div>
);
