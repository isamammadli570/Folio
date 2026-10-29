import {cn} from "@/lib/utils";

type BustProps = {
    src: string;
    alt: string;
    className?: string;
    /** The hero bust loads at once; thumbnails wait until they are near the screen. */
    priority?: boolean;
};

/** A cut-out marble bust whose foot dissolves into the dark page, so it seems to rise out of the background. */
export const Bust = ({src, alt, className, priority = false}: BustProps) => (
    <img
        src={src}
        alt={alt}
        draggable={false}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className={cn("bust pointer-events-none select-none object-contain object-bottom", className)}
    />
);
