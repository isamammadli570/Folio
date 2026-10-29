import {useEffect, useRef, type CSSProperties, type ElementType, type ReactNode} from "react";
import {observeOnce} from "@/lib/reveal";
import {cn} from "@/lib/utils";

type RevealProps = {
    as?: ElementType;
    /** "up" rises, "fade" only fades, "scale" grows a touch, "stagger" reveals its children one after another. */
    variant?: "up" | "fade" | "scale" | "left" | "stagger";
    delay?: number;
    className?: string;
    style?: CSSProperties;
    id?: string;
    children: ReactNode;
};

/**
 * Shows its content with a short rise or fade the first time it scrolls into view. Content is in the DOM from the
 * start (search engines and screen readers see it); only opacity and transform change, and "reduce motion" skips it.
 */
export const Reveal = ({as: Tag = "div", variant = "up", delay = 0, className, style, id, children}: RevealProps) => {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;
        return observeOnce(element, () => element.setAttribute("data-visible", ""));
    }, []);

    return (
        <Tag ref={ref} id={id} data-reveal={variant} className={cn(className)} style={delay ? {...style, "--reveal-delay": `${delay}ms`} as CSSProperties : style}>
            {children}
        </Tag>
    );
};
