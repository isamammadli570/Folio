import {cn} from "@/lib/utils";

type BustProps = {
    src: string;
    alt: string;
    className?: string;
    /** The hero bust loads at once; thumbnails wait until they are near the screen. */
    priority?: boolean;
};

/** The small copy (160px tall) of a bust shipped with the site (see scripts/generate-thumbs.mjs); uploaded busts have none. */
export const bustThumb = (src: string) => (src.startsWith("/authors/") ? src.replace("/authors/", "/authors/thumbs/") : src);

/** The medium copy (400px tall), for medallions in lists and cards. */
export const bustMedium = (src: string) => (src.startsWith("/authors/") ? src.replace("/authors/", "/authors/md/") : src);

/** A cut-out marble bust whose foot dissolves into the dark page, so it seems to rise out of the background. */
export const Bust = ({src, alt, className, priority = false}: BustProps) => (
    <img
        src={src}
        alt={alt}
        draggable={false}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "auto" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        className={cn("bust pointer-events-none select-none object-contain object-bottom", className)}
    />
);
