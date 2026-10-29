import {memo} from "react";

/**
 * The gilt tooling of a cloth binding, on the cover's own 200×300 grid: a heavy outer fillet, a fine inner one with
 * concave corners in the manner of Victorian bindings, and a gold dot set into each corner. One SVG, no gradients,
 * so dozens of covers on a page cost almost nothing.
 */
export const CoverFrame = memo(() => (
    <svg viewBox="0 0 200 300" aria-hidden className="book-cover__tooling" fill="none" stroke="currentColor">
        <rect x="9" y="9" width="182" height="282" strokeWidth="1.3"/>
        <rect x="11.6" y="11.6" width="176.8" height="276.8" strokeWidth="0.45"/>
        <path d="M27 16H173A11 11 0 0 0 184 27V273A11 11 0 0 0 173 284H27A11 11 0 0 0 16 273V27A11 11 0 0 0 27 16Z" strokeWidth="0.7"/>
        <g fill="currentColor" stroke="none">
            <circle cx="20.2" cy="20.2" r="1.7"/>
            <circle cx="179.8" cy="20.2" r="1.7"/>
            <circle cx="20.2" cy="279.8" r="1.7"/>
            <circle cx="179.8" cy="279.8" r="1.7"/>
            <path d="M100 9.6l2.6 2.6-2.6 2.6-2.6-2.6Z"/>
            <path d="M100 285.2l2.6 2.6-2.6 2.6-2.6-2.6Z"/>
        </g>
    </svg>
));

/** A fleuron between two fillets, set under the title. */
export const Fleuron = () => (
    <svg viewBox="0 0 80 12" aria-hidden className="book-cover__fleuron" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round">
        <path d="M2 6h24M54 6h24"/>
        <path d="M40 1.5c-3 2-6 2.6-9 1.4 1.6 2.6 4.6 3.4 9 3.1-4.4-.3-7.4.5-9 3.1 3-1.2 6-.6 9 1.4 3-2 6-2.6 9-1.4-1.6-2.6-4.6-3.4-9-3.1 4.4.3 7.4-.5 9-3.1-3 1.2-6 .6-9-1.4Z" fill="currentColor" stroke="none"/>
        <circle cx="29" cy="6" r="1" fill="currentColor" stroke="none"/>
        <circle cx="51" cy="6" r="1" fill="currentColor" stroke="none"/>
    </svg>
);
