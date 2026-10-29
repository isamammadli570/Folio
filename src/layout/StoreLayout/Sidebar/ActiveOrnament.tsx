/** A small carved swirl that marks the selected tab. It draws itself in once when the tab becomes active. */
export const ActiveOrnament = () => (
    <svg viewBox="0 0 40 18" aria-hidden className="relative h-4 w-9 shrink-0 text-brand" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path pathLength={1} className="ornament-draw" d="M2 13c4-10 11-10 12-4s-6 5-6 1 6-7 12-3 7 4 10 0"/>
        <circle cx="32" cy="6" r="1.7" className="ornament-bead"/>
        <circle cx="36.5" cy="10.5" r="1.2" className="ornament-bead" style={{animationDelay: "850ms"}}/>
    </svg>
);
