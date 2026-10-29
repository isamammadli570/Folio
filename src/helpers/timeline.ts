import {PERIOD_IDS, type PeriodId} from "@/constants/catalog";

/**
 * The timeline gives each period a quarter of its width, so antiquity's thirteen centuries and the twentieth
 * century both stay readable. Each entry is the period's first year and the year where its quarter ends.
 */
const SEGMENTS: {period: PeriodId; from: number; to: number}[] = [
    {period: "ancient", from: -800, to: 500},
    {period: "medieval", from: 500, to: 1500},
    {period: "modern", from: 1500, to: 1900},
    {period: "contemporary", from: 1900, to: 2000},
];

export const TIMELINE_PERIODS = PERIOD_IDS;

/** Position of a year on the timeline, 0 (800 BCE) to 100 (2000), in percent. Years outside are clamped. */
export const timelinePosition = (year: number): number => {
    const clamped = Math.min(2000, Math.max(-800, year));
    const index = SEGMENTS.findIndex((segment) => clamped <= segment.to);
    const segment = SEGMENTS[index === -1 ? SEGMENTS.length - 1 : index];
    const within = (clamped - segment.from) / (segment.to - segment.from);
    return (SEGMENTS.indexOf(segment) + within) * 25;
};
