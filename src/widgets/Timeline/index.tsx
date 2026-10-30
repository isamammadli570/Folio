import type {CSSProperties} from "react";
import {Link} from "react-router";
import {useTranslation} from "react-i18next";
import {formatYear} from "@/helpers/format";
import {TIMELINE_PERIODS, timelinePosition} from "@/helpers/timeline";
import {Reveal} from "@/widgets/Reveal";
import {cn} from "@/lib/utils";

export type TimelineMark = {
    year: number;
    approx?: boolean;
    label: string;
    href?: string;
};

type TimelineProps = {
    title: string;
    /** The author's life, drawn as a gold bar. */
    life?: {born: number; died: number; label: string};
    marks: TimelineMark[];
    className?: string;
};

/**
 * Three thousand years on one line: four periods, the author's lifetime as a gold bar, and a pin for each work.
 * The bar grows and the pins drop in when the strip scrolls into view. Pins that land close together alternate above
 * and below the line so their labels don't collide. On phones several pins are numbered instead, with the titles listed
 * under the line, since a 340px line has no room for side-by-side labels.
 */
export const Timeline = ({title, life, marks, className}: TimelineProps) => {
    const {t} = useTranslation(["catalog", "common"]);
    const sorted = [...marks].sort((a, b) => a.year - b.year);
    const numbered = sorted.length > 1;
    // Pins closer than this (in % of the line) share one number label on phones: "1–3" instead of three stacked digits.
    const groups = sorted.reduce<{position: number; from: number; to: number}[]>((list, mark, index) => {
        const position = timelinePosition(mark.year);
        const last = list.at(-1);
        if (last && position - last.position < 7) last.to = index + 1;
        else list.push({position, from: index + 1, to: index + 1});
        return list;
    }, []);

    return (
        <Reveal as="section" className={cn("border border-border bg-surface px-6 pb-8 pt-6 sm:px-8", className)}>
            <p className="text-[10.5px] font-medium uppercase tracking-[0.22em] text-accent">{title}</p>
            <div className={cn("relative mx-2 mb-14 mt-16", numbered && "max-sm:mb-8 max-sm:mt-10")}>
                <div className="h-px bg-border-strong"/>
                {[25, 50, 75].map((left) => <span key={left} aria-hidden className="absolute -top-1.5 h-3 w-px bg-border-strong" style={{left: `${left}%`}}/>)}

                {life && (
                    <div className="timeline-life absolute -top-[3px] h-[7px] rounded-full bg-accent/80" style={{left: `${timelinePosition(life.born)}%`, width: `${Math.max(1, timelinePosition(life.died) - timelinePosition(life.born))}%`}} title={life.label}/>
                )}

                {sorted.map((mark, index) => {
                    const above = index % 2 === 0;
                    const content = (
                        <>
                            <span className="block font-serif text-[14px] leading-tight text-foreground">{mark.label}</span>
                            <span className="tabular block text-[11px] text-muted-foreground">{formatYear(mark.year, t, mark.approx)}</span>
                        </>
                    );
                    return (
                        <div key={`${mark.label}-${mark.year}`} className="timeline-mark absolute top-0" style={{left: `${timelinePosition(mark.year)}%`, transitionDelay: `${900 + index * 120}ms`} as CSSProperties}>
                            <span aria-hidden className="absolute left-0 top-0 size-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-accent bg-background"/>
                            <span aria-hidden className={cn("absolute left-0 w-px bg-accent/50", above ? "bottom-1.5 h-5" : "top-1.5 h-5", numbered && "max-sm:hidden")}/>
                            <div className={cn("absolute w-max max-w-[11rem] -translate-x-1/2 text-center", above ? "bottom-7" : "top-7", numbered && "max-sm:hidden")}>
                                {mark.href ? <Link to={mark.href} className="block hover:[&>span:first-child]:text-accent-bright">{content}</Link> : content}
                            </div>
                        </div>
                    );
                })}
                {numbered && groups.map((group) => (
                    <span key={group.from} aria-hidden className="tabular absolute bottom-3 -translate-x-1/2 whitespace-nowrap font-serif text-[13px] leading-none text-accent-bright sm:hidden" style={{left: `${group.position}%`}}>
                        {group.from === group.to ? group.from : `${group.from}–${group.to}`}
                    </span>
                ))}
            </div>
            <div className="mx-2 grid grid-cols-4 text-[10px] uppercase tracking-[0.1em] text-faint-foreground sm:tracking-[0.16em]">
                {TIMELINE_PERIODS.map((period) => <span key={period} className="border-l border-border pl-2">{t(`filters.periods.${period}`)}</span>)}
            </div>
            {numbered && (
                <ol className="mx-2 mt-5 flex flex-col gap-2 border-t border-border pt-4 sm:hidden">
                    {sorted.map((mark, index) => (
                        <li key={`${mark.label}-${mark.year}`} className="grid grid-cols-[1.25rem_minmax(0,1fr)_auto] items-baseline gap-2">
                            <span className="tabular font-serif text-[13px] text-accent-bright">{index + 1}</span>
                            {mark.href ? <Link to={mark.href} className="truncate font-serif text-[15px] hover:text-accent-bright">{mark.label}</Link> : <span className="truncate font-serif text-[15px]">{mark.label}</span>}
                            <span className="tabular text-[11px] text-muted-foreground">{formatYear(mark.year, t, mark.approx)}</span>
                        </li>
                    ))}
                </ol>
            )}
            {life && <p className="mx-2 mt-4 flex items-center gap-2 text-xs text-muted-foreground"><span aria-hidden className="h-[5px] w-6 rounded-full bg-accent/80"/>{life.label}</p>}
        </Reveal>
    );
};
