import {useMemo, type CSSProperties} from "react";
import {cn} from "@/lib/utils";

type AstrolabeProps = {
    className?: string;
};

/** A few constellation stars on the 600×600 face, joined by hairlines. Hand-placed, so the figure reads as a sky. */
const STARS: [number, number, number][] = [
    [214, 168, 2.4], [268, 132, 1.6], [330, 150, 2], [372, 206, 1.4], [352, 262, 2.6],
    [292, 280, 1.5], [246, 238, 1.8], [402, 318, 1.6], [438, 252, 2.1],
];
const LINKS: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0], [4, 7], [3, 8]];

/**
 * A brass astrolabe drawn in hairlines: an outer scale of degree ticks turning slowly one way, a dashed rete turning the
 * other, and a small constellation whose stars twinkle. Each moving part is its own layer and only rotates or fades,
 * so the browser composites it without repainting. A radial mask dissolves the edges into the page.
 */
export const Astrolabe = ({className}: AstrolabeProps) => {
    const ticks = useMemo(
        () => Array.from({length: 120}, (_, index) => {
            const angle = (index / 120) * Math.PI * 2;
            const long = index % 10 === 0;
            const inner = long ? 262 : 272;
            return `M${300 + Math.cos(angle) * inner} ${300 + Math.sin(angle) * inner}L${300 + Math.cos(angle) * 284} ${300 + Math.sin(angle) * 284}`;
        }).join(""),
        [],
    );

    return (
        <div aria-hidden className={cn("astrolabe pointer-events-none", className)}>
            <svg viewBox="0 0 600 600" className="astrolabe__layer astrolabe__scale" fill="none" stroke="currentColor">
                <circle cx="300" cy="300" r="290" strokeWidth="0.8"/>
                <circle cx="300" cy="300" r="256" strokeWidth="0.5"/>
                <path d={ticks} strokeWidth="0.7"/>
            </svg>
            <svg viewBox="0 0 600 600" className="astrolabe__layer astrolabe__rete" fill="none" stroke="currentColor">
                <circle cx="300" cy="300" r="214" strokeWidth="0.6" strokeDasharray="2 7"/>
                <circle cx="300" cy="244" r="150" strokeWidth="0.5"/>
                <path d="M300 86V514M86 300H514" strokeWidth="0.4" strokeDasharray="1 5"/>
                <circle cx="300" cy="300" r="6" strokeWidth="0.8"/>
            </svg>
            <svg viewBox="0 0 600 600" className="astrolabe__layer" fill="none" stroke="currentColor">
                <circle cx="300" cy="300" r="120" strokeWidth="0.4"/>
                <path d={LINKS.map(([a, b]) => `M${STARS[a][0]} ${STARS[a][1]}L${STARS[b][0]} ${STARS[b][1]}`).join("")} strokeWidth="0.5" opacity="0.6"/>
            </svg>
            {/* Stars are plain elements, not SVG, so their twinkle runs on the compositor without repainting the drawing. */}
            {STARS.map(([x, y, r], index) => (
                <span
                    key={index}
                    className="astrolabe__star"
                    style={{left: `${x / 6}%`, top: `${y / 6}%`, width: r * 2.4, height: r * 2.4, "--i": index} as CSSProperties}
                />
            ))}
        </div>
    );
};
