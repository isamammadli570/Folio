import {cn} from "@/lib/utils";

type SceneArcProps = {
    /** An old engraving or painting from the author's world; without one the hatched initial fills the arc. */
    src?: string;
    letter: string;
    /** Fades the picture out while the author changes. */
    isHidden?: boolean;
};

/**
 * The half-circle on the left of an author hero: a disc far taller than the section, so only its right arc shows,
 * reaching in behind the bust. Inside, the scene in sepia under a fine dot screen, with a double hairline on its rim.
 * Its parent must be `relative` and `overflow-hidden`.
 */
export const SceneArc = ({src, letter, isHidden = false}: SceneArcProps) => (
    <>
        <div aria-hidden className="scene-arc pointer-events-none absolute left-[-16rem] top-[38%] size-[min(780px,125vw)] -translate-y-1/2 overflow-hidden rounded-full lg:left-[calc(50%-1500px)] lg:top-1/2 lg:size-[1360px]">
            {src ? (
                <img
                    src={src}
                    alt=""
                    draggable={false}
                    className={cn(
                        "absolute inset-0 size-full object-cover opacity-45 transition-opacity duration-500 [filter:sepia(0.35)_contrast(1.05)]",
                        "lg:inset-auto lg:right-0 lg:top-1/2 lg:h-[800px] lg:w-[min(820px,62vw)] lg:-translate-y-1/2 lg:opacity-80",
                        isHidden && "opacity-0 lg:opacity-0",
                    )}
                />
            ) : (
                <span className={cn("hatched absolute right-0 top-1/2 -translate-y-1/2 font-display text-[clamp(380px,48vw,640px)] italic leading-none transition-opacity duration-500", isHidden && "opacity-0")}>{letter}</span>
            )}
            <div className="absolute inset-0 bg-[radial-gradient(color-mix(in_srgb,var(--background)_45%,transparent)_1.1px,transparent_1.7px)] bg-[length:5px_5px]"/>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_srgb,var(--background)_35%,transparent)_45%,transparent_75%,color-mix(in_srgb,var(--background)_45%,transparent)_100%)]"/>
        </div>
        <div aria-hidden className="pointer-events-none absolute left-[-16rem] top-[38%] size-[min(780px,125vw)] -translate-y-1/2 rounded-full border border-accent/25 lg:left-[calc(50%-1500px)] lg:top-1/2 lg:size-[1360px]"/>
        <div aria-hidden className="pointer-events-none absolute hidden rounded-full border border-accent/15 lg:left-[calc(50%-1470px)] lg:top-1/2 lg:block lg:size-[1420px] lg:-translate-y-1/2"/>
    </>
);
