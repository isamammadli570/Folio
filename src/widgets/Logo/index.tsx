import type {CSSProperties} from "react";
import {useTranslation} from "react-i18next";
import {cn} from "@/lib/utils";

type LogoProps = {
    className?: string;
    /** Only the mark, for small places. */
    compact?: boolean;
};

/**
 * The Folio mark: an open book under a small flame of learning, inside a double ring. On first paint the lines draw
 * themselves in and the flame lights; on hover a page turns. Next to it the wordmark rises letter by letter.
 * Only stroke offsets, opacity and transforms animate, so it costs nothing after the first second.
 */
export const Logo = ({className, compact = false}: LogoProps) => {
    const {t} = useTranslation();
    const name = t("brand.name");

    return (
        <span className={cn("logo group/logo inline-flex items-center gap-3", className)}>
            <svg viewBox="0 0 40 40" aria-hidden className="logo__mark size-10 shrink-0 overflow-visible" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="20" cy="20" r="18.5" pathLength={1} className="logo__draw stroke-accent/80" strokeWidth="1"/>
                <circle cx="20" cy="20" r="16" pathLength={1} className="logo__draw stroke-accent/30 [animation-delay:120ms]" strokeWidth="0.8"/>
                <g className="stroke-accent-bright" strokeWidth="1.1">
                    <path pathLength={1} className="logo__draw [animation-delay:260ms]" d="M20 28.5c-3.2-1.9-7-2.2-10.5-1V15.2c3.5-1.2 7.3-.9 10.5 1z"/>
                    <path pathLength={1} className="logo__draw [animation-delay:320ms]" d="M20 28.5c3.2-1.9 7-2.2 10.5-1V15.2c-3.5-1.2-7.3-.9-10.5 1z"/>
                    <path pathLength={1} className="logo__draw stroke-accent/70 [animation-delay:520ms]" strokeWidth="0.8" d="M12 18.7c2.3-.5 4.6-.3 6.4.5M12 21.7c2.3-.5 4.6-.3 6.4.5M28 18.7c-2.3-.5-4.6-.3-6.4.5M28 21.7c-2.3-.5-4.6-.3-6.4.5"/>
                    <path className="logo__page" d="M20 28.5c3.2-1.9 7-2.2 10.5-1V15.2c-3.5-1.2-7.3-.9-10.5 1z"/>
                </g>
                <path className="logo__flame fill-accent-bright" d="M20 6.8c2.2 2.2 2.6 4.6 0 6.8-2.6-2.2-2.2-4.6 0-6.8z"/>
            </svg>
            {!compact && (
                <>
                    <span className="whitespace-nowrap font-display text-[28px] font-semibold leading-none tracking-wide" aria-label={name}>
                        {[...name].map((letter, index) => (
                            <span key={index} aria-hidden className="logo__letter inline-block" style={{"--i": index} as CSSProperties}>{letter}</span>
                        ))}
                    </span>
                    <span aria-hidden className="logo__rule h-7 w-px origin-top bg-accent/70"/>
                    <span className="logo__tagline max-w-16 text-[9.5px] font-medium uppercase leading-tight tracking-[0.26em] text-muted-foreground">{t("brand.tagline")}</span>
                </>
            )}
        </span>
    );
};
