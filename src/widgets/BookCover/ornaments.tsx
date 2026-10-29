import type {Ornament} from "@/constants/catalog";

/** Line emblems for the covers, drawn on a 40×40 grid with a 1.2 stroke. Each book picks one that suits its subject. */
const PATHS: Record<Ornament, string> = {
    column: "M10 8h20M12 11h16M14 11v20M20 11v20M26 11v20M12 31h16M10 34h20",
    star: "M20 5l3.5 11H35l-9.3 6.8 3.5 11L20 27l-9.2 6.8 3.5-11L5 16h11.5Z",
    laurel: "M20 36V10M20 14c-4-1-7-4-7-8 4 0 7 3 7 8ZM20 14c4-1 7-4 7-8-4 0-7 3-7 8ZM20 22c-5-1-8-4-8-9 5 0 8 4 8 9ZM20 22c5-1 8-4 8-9-5 0-8 4-8 9ZM20 30c-5-1-8-4-8-9 5 0 8 4 8 9ZM20 30c5-1 8-4 8-9-5 0-8 4-8 9Z",
    sun: "M20 14a6 6 0 1 0 0 12 6 6 0 1 0 0-12M20 4v6M20 30v6M4 20h6M30 20h6M8.7 8.7l4.2 4.2M27.1 27.1l4.2 4.2M8.7 31.3l4.2-4.2M27.1 12.9l4.2-4.2",
    quill: "M32 5C20 8 12 18 10 34M32 5c-2 8-8 15-17 19M32 5c-6 3-12 4-17 9M10 34l4-6",
    compass: "M20 4v4M20 8l-8 26M20 8l8 26M14.5 26h11M20 8a2.5 2.5 0 1 0 0 .01",
    amphora: "M15 6h10M16 6v4c-6 3-8 9-6 15 2 5 6 8 10 9 4-1 8-4 10-9 2-6 0-12-6-15V6M16 12c-5 0-6 5-3 7M24 12c5 0 6 5 3 7M11 22h18",
    eye: "M4 20s6-10 16-10 16 10 16 10-6 10-16 10S4 20 4 20ZM20 15a5 5 0 1 0 0 10 5 5 0 1 0 0-10M20 18.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3",
    key: "M13 14a6 6 0 1 0 0 12 6 6 0 1 0 0-12M19 20h16M30 20v5M35 20v4",
};

type OrnamentIconProps = {
    name: Ornament;
    className?: string;
};

export const OrnamentIcon = ({name, className}: OrnamentIconProps) => (
    <svg viewBox="0 0 40 40" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d={PATHS[name]}/>
    </svg>
);
