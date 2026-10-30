import type {ReactNode} from "react";
import {cn} from "@/lib/utils";
import {useDocumentTitle} from "@/hooks/useDocumentTitle";

type PageTitleProps = {
    eyebrow?: string;
    title: string;
    description?: string;
    actions?: ReactNode;
    className?: string;
    /** The browser tab's title when it should differ from the heading. */
    documentTitle?: string;
};

/** Eyebrow, large serif title, an optional line under it and actions on the right. */
export const PageTitle = ({eyebrow, title, description, actions, className, documentTitle}: PageTitleProps) => {
    useDocumentTitle(documentTitle ?? title);
    return (
        <header className={cn("flex flex-wrap items-end justify-between gap-6", className)}>
            <div className="min-w-0 max-w-2xl">
                {eyebrow && <p className="eyebrow">{eyebrow}</p>}
                <h1 className="mt-3 font-serif text-[clamp(38px,5vw,60px)] font-normal leading-[1.02] [text-wrap:balance]">{title}</h1>
                {description && <p className="mt-4 max-w-[60ch] text-[15px] leading-relaxed text-muted-foreground">{description}</p>}
            </div>
            {actions}
        </header>
    );
};
