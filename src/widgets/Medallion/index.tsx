import {forwardRef, useMemo} from "react";
import {marbleTexture} from "@/lib/marble";
import {cn} from "@/lib/utils";

type MedallionProps = {
    /** The carved letter, usually the first letter of the surname. */
    letter: string;
    /** A cut-out bust (transparent webp). It stands in a dark disc and its head rises above the rim. */
    portrait?: string;
    alt?: string;
    /** Larger medallions get a finer marble texture. */
    size?: "sm" | "lg";
    className?: string;
};

/**
 * The author's emblem in lists and cards. With a bust it is a cameo: the marble figure on a dark disc, its shoulders cut
 * by the circle and its head breaking out over the bronze rim, a little in front of the disc in 3D so it shifts when a
 * parent tilts it. Without one, a marble disc with a carved initial.
 * Everything scales with the medallion's width, so the same component is a 36px icon and a 380px centrepiece.
 */
export const Medallion = forwardRef<HTMLDivElement, MedallionProps>(({letter, portrait, alt, size = "sm", className}, ref) => {
    const texture = useMemo(() => (portrait ? "" : marbleTexture(size === "lg" ? 640 : 180, size === "lg" ? 97 : 31)), [portrait, size]);

    return (
        <div ref={ref} className={cn("medallion aspect-square [transform-style:preserve-3d]", portrait && "medallion--bust", className)}>
            <div className="medallion__rim"/>
            <div className="medallion__face" style={texture ? {backgroundImage: `url(${texture})`} : undefined}>
                {!portrait && <span className="medallion__letter" aria-hidden>{letter}</span>}
                {size === "lg" && <span aria-hidden className="medallion__glint"/>}
            </div>
            {portrait && (
                <div className="medallion__bust">
                    <img src={portrait} alt={alt ?? ""} loading={size === "lg" ? "eager" : "lazy"} draggable={false}/>
                </div>
            )}
        </div>
    );
});
