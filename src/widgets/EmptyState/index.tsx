import type {ReactNode} from "react";
import {cn} from "@/lib/utils";

type EmptyStateProps = {
    title: string;
    description?: string;
    /** A line from a classic, shown large above the title. */
    quote?: {text: string; cite: string};
    action?: ReactNode;
    className?: string;
};

/** An empty shelf: a quotation in italic serif, what is missing, and the way forward. */
export const EmptyState = ({title, description, quote, action, className}: EmptyStateProps) => (
    <div className={cn("animate-fade-up flex flex-col items-center gap-5 border border-dashed border-border-strong px-6 py-16 text-center", className)}>
        <span aria-hidden className="size-2 rotate-45 border border-accent"/>
        {quote && (
            <figure className="max-w-md">
                <blockquote className="font-serif text-2xl italic leading-snug">«{quote.text}»</blockquote>
                <figcaption className="mt-2 text-[11px] uppercase tracking-[0.22em] text-accent">{quote.cite}</figcaption>
            </figure>
        )}
        <div className="space-y-1.5">
            <p className="text-[15px] font-medium">{title}</p>
            {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
        </div>
        {action}
    </div>
);
