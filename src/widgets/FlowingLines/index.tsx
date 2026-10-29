import {useMemo} from "react";
import {cn} from "@/lib/utils";

type FlowingLinesProps = {
    className?: string;
    /** Shifts the wave so two sets of lines on one page don't look identical. */
    phase?: number;
    count?: number;
};

/** A ribbon of fine gold curves, like engraved guilloché; purely decorative. */
export const FlowingLines = ({className, phase = 0, count = 34}: FlowingLinesProps) => {
    const paths = useMemo(
        () =>
            Array.from({length: count}, (_, index) => {
                const offset = index * 5.2;
                const wave = Math.sin(index * 0.35 + phase) * 14;
                const opacity = 0.25 + 0.75 * Math.sin((index / (count - 1)) * Math.PI);
                return {d: `M-20 ${40 + offset} C ${150 + wave} ${-30 + offset * 1.4}, ${260 - wave} ${210 + offset * 0.6}, 580 ${90 + offset * 1.1}`, opacity};
            }),
        [count, phase],
    );

    return (
        <svg viewBox="0 0 560 420" aria-hidden className={cn("pointer-events-none fill-none stroke-accent", className)} strokeWidth="0.6">
            {paths.map((path) => <path key={path.d} d={path.d} opacity={path.opacity.toFixed(2)}/>)}
        </svg>
    );
};
