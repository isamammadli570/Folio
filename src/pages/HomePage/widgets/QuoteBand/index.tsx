import {Fragment, useEffect, useState, type CSSProperties} from "react";
import {useTranslation} from "react-i18next";
import {usePrefersReducedMotion} from "@/hooks/usePrefersReducedMotion";
import {GoldDust} from "@/widgets/GoldDust";
import {Reveal} from "@/widgets/Reveal";
import {cn} from "@/lib/utils";

type Quote = {text: string; cite: string};

const INTERVAL_MS = 7000;

/**
 * An epigraph between the shelf and the footer: four classics on books and reading, one at a time. Each line writes
 * itself in word by word; thin progress bars under it show the turn and let the visitor pick a quote. It pauses while
 * the pointer rests on it.
 */
export const QuoteBand = () => {
    const {t} = useTranslation("home");
    const reducedMotion = usePrefersReducedMotion();
    const quotes = t("quotes.items", {returnObjects: true}) as Quote[];
    const [index, setIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const quote = quotes[index % quotes.length];

    useEffect(() => {
        if (isPaused || reducedMotion) return;
        const timer = window.setTimeout(() => setIndex((current) => (current + 1) % quotes.length), INTERVAL_MS);
        return () => window.clearTimeout(timer);
    }, [index, isPaused, quotes.length, reducedMotion]);

    return (
        <section
            className="relative isolate mt-24 overflow-hidden bg-[var(--night)]"
            onPointerEnter={() => setIsPaused(true)}
            onPointerLeave={() => setIsPaused(false)}
        >
            <span aria-hidden className="pointer-events-none absolute -left-6 -top-24 font-display text-[clamp(320px,40vw,560px)] leading-none text-transparent [-webkit-text-stroke:1px_color-mix(in_srgb,var(--accent)_22%,transparent)]">“</span>
            <div aria-hidden className="halftone pointer-events-none absolute -right-40 top-1/2 size-[640px] -translate-y-1/2 rounded-full opacity-60"/>
            <div aria-hidden className="pointer-events-none absolute -right-24 top-1/2 size-[520px] -translate-y-1/2 rounded-full border border-accent/15"/>
            <GoldDust className="absolute inset-0" count={20} seed={23}/>

            <Reveal className="px-gutter relative mx-auto flex max-w-[980px] flex-col items-center py-24 text-center md:py-32">
                <div aria-hidden className="flex items-center gap-3">
                    <span className="quote-rule h-px w-14 origin-right bg-accent/60"/>
                    <span className="size-1.5 rotate-45 border border-accent"/>
                    <span className="quote-rule h-px w-14 origin-left bg-accent/60"/>
                </div>
                <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.3em] text-accent">{t("quotes.eyebrow")}</p>

                <figure className="mt-10 min-h-[11.5rem] md:min-h-[13rem]" aria-live="polite">
                    <blockquote key={`q-${index}`} className="font-display text-[clamp(30px,4.4vw,56px)] font-medium italic leading-[1.14] [text-wrap:balance]">
                        {quote.text.split(" ").map((word, wordIndex) => (
                            // A plain space between the word boxes keeps the line breakable.
                            <Fragment key={wordIndex}><span className="quote-word inline-block" style={{"--i": wordIndex} as CSSProperties}>{word}</span>{" "}</Fragment>
                        ))}
                    </blockquote>
                    <figcaption key={`c-${index}`} className="animate-fade-up mt-8 inline-flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-accent [animation-delay:500ms]">
                        <span aria-hidden className="size-1 rotate-45 bg-accent"/>
                        {quote.cite}
                        <span aria-hidden className="size-1 rotate-45 bg-accent"/>
                    </figcaption>
                </figure>

                <div className="mt-12 flex items-center gap-2.5">
                    {quotes.map((_, quoteIndex) => (
                        <button
                            key={quoteIndex}
                            type="button"
                            onClick={() => setIndex(quoteIndex)}
                            aria-label={t("quotes.show", {index: quoteIndex + 1})}
                            aria-current={quoteIndex === index}
                            className="group relative h-6 w-12 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                        >
                            <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-accent/25 transition-colors group-hover:bg-accent/50"/>
                            {quoteIndex === index && (
                                <span
                                    key={index}
                                    className={cn("absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 origin-left bg-accent", !reducedMotion && "[animation:progress-fill_linear_forwards]")}
                                    style={{animationDuration: `${INTERVAL_MS}ms`, animationPlayState: isPaused ? "paused" : "running"}}
                                />
                            )}
                            {quoteIndex < index && <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-accent/60"/>}
                        </button>
                    ))}
                </div>
            </Reveal>
        </section>
    );
};
