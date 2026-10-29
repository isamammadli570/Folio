import {useMemo, type CSSProperties} from "react";
import {cn} from "@/lib/utils";

type GoldDustProps = {
    className?: string;
    count?: number;
    /** Changes the scatter, so two fields on one page don't match. */
    seed?: number;
};

/** Seeded positions, sizes and timings for the motes; the same seed always gives the same field. */
const scatter = (count: number, seed: number) => {
    let state = seed;
    const random = () => (state = (state * 16807) % 2147483647) / 2147483647;
    return Array.from({length: count}, () => ({
        left: `${random() * 100}%`,
        top: `${30 + random() * 70}%`,
        size: 1 + random() * 2.2,
        duration: 9 + random() * 10,
        delay: -random() * 18,
        drift: (random() - 0.5) * 60,
    }));
};

/**
 * Motes of gold drifting slowly upwards and fading, like dust in a beam of light. Each mote is a small element that only
 * moves and fades on the compositor; positions come from a seeded sequence, so they stay the same between renders.
 */
export const GoldDust = ({className, count = 18, seed = 7}: GoldDustProps) => {
    const motes = useMemo(() => scatter(count, seed), [count, seed]);

    return (
        <div aria-hidden className={cn("pointer-events-none overflow-hidden", className)}>
            {motes.map((mote, index) => (
                <span
                    key={index}
                    className="gold-mote"
                    style={{
                        left: mote.left,
                        top: mote.top,
                        width: mote.size,
                        height: mote.size,
                        animationDuration: `${mote.duration}s`,
                        animationDelay: `${mote.delay}s`,
                        "--drift": `${mote.drift}px`,
                    } as CSSProperties}
                />
            ))}
        </div>
    );
};
