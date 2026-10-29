import {useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent} from "react";
import {Link} from "react-router";
import {ArrowRight, ChevronLeft, ChevronRight} from "lucide-react";
import {useTranslation} from "react-i18next";
import type {AuthorSummary} from "@/api/authors.api";
import {Skeleton} from "@/components/ui/skeleton";
import {buildRoute} from "@/constants/routes";
import {SPOTLIGHT_INTERVAL_MS} from "@/constants/other";
import {useLanguage} from "@/hooks/useLanguage";
import {usePrefersReducedMotion} from "@/hooks/usePrefersReducedMotion";
import {formatLifespan, surname, upper} from "@/helpers/format";
import {Astrolabe} from "@/widgets/Astrolabe";
import {GoldDust} from "@/widgets/GoldDust";
import {SceneArc} from "@/widgets/SceneArc";
import {Bust} from "@/widgets/Bust";
import {Medallion} from "@/widgets/Medallion";
import {cn} from "@/lib/utils";

type AuthorSpotlightProps = {
    authors: AuthorSummary[];
    isLoading: boolean;
    index: number;
    onIndexChange: (index: number) => void;
};

/**
 * The home hero: one author at a time in a dark museum hall. Left, the dates and a short life; centre, the marble
 * medallion that turns like a coin when the author changes; right, the name, a line in the author's own language with
 * its translation, and a strip of medallions to move between authors. It advances by itself and pauses on hover.
 */
export const AuthorSpotlight = ({authors, isLoading, index, onIndexChange}: AuthorSpotlightProps) => {
    const {t} = useTranslation(["home", "common"]);
    const {language, pick} = useLanguage();
    const reducedMotion = usePrefersReducedMotion();
    const [shown, setShown] = useState(index);
    const [isPaused, setIsPaused] = useState(false);
    const coinRef = useRef<HTMLDivElement>(null);
    const stripRef = useRef<HTMLDivElement>(null);
    const author = authors[shown];

    // The bust drifts out sideways and blurs while the text fades; halfway the next author is swapped in and everything
    // settles back. Driven by a timer and CSS transitions, so a hidden tab or a fast double click never strands it.
    const isLeaving = index !== shown;
    useEffect(() => {
        if (index === shown) return;
        const timer = window.setTimeout(() => setShown(index), reducedMotion ? 0 : 420);
        return () => window.clearTimeout(timer);
    }, [index, reducedMotion, shown]);

    // Keep the active thumbnail in view by scrolling the strip itself, never the page.
    useEffect(() => {
        const strip = stripRef.current;
        const thumb = strip?.children[index] as HTMLElement | undefined;
        if (!strip || !thumb) return;
        strip.scrollTo({left: thumb.offsetLeft - strip.clientWidth / 2 + thumb.clientWidth / 2, behavior: reducedMotion ? "auto" : "smooth"});
    }, [index, reducedMotion]);

    const go = useCallback((next: number) => {
        if (authors.length === 0) return;
        onIndexChange((next + authors.length) % authors.length);
    }, [authors.length, onIndexChange]);

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "ArrowRight") go(index + 1);
        if (event.key === "ArrowLeft") go(index - 1);
    };

    const tiltMedal = (event: PointerEvent) => {
        if (event.pointerType === "touch" || !coinRef.current) return;
        const rect = coinRef.current.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        coinRef.current.style.setProperty("--ry", `${(x * 10).toFixed(1)}deg`);
        coinRef.current.style.setProperty("--rx", `${(-y * 6).toFixed(1)}deg`);
    };

    const name = author ? pick(author.name) : "";
    const letter = surname(name)[0] ?? "";

    return (
        <section
            aria-roledescription="carousel"
            aria-label={t("spotlight.label")}
            onKeyDown={onKeyDown}
            onPointerEnter={() => setIsPaused(true)}
            onPointerLeave={() => {
                setIsPaused(false);
                coinRef.current?.style.setProperty("--ry", "0deg");
                coinRef.current?.style.setProperty("--rx", "0deg");
            }}
            onPointerMove={tiltMedal}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={() => setIsPaused(false)}
            className="relative isolate overflow-hidden bg-[radial-gradient(60%_70%_at_18%_45%,var(--hero-glow),transparent_70%),radial-gradient(50%_60%_at_55%_55%,var(--hero-glow-soft),transparent_70%)]"
        >
            <SceneArc src={author?.scene} letter={letter} isHidden={isLeaving}/>
            <div aria-hidden className="pointer-events-none absolute left-[6%] top-[-150px] size-[820px] rounded-full border border-accent/20"/>
            <div aria-hidden className="pointer-events-none absolute left-[14%] top-[-250px] size-[980px] rounded-full border border-accent/10"/>
            <Astrolabe className="-right-48 -top-48 w-[min(680px,95vw)] max-lg:opacity-60"/>
            <GoldDust className="absolute bottom-0 right-0 h-3/5 w-3/5" count={22}/>

            <div className="px-gutter relative mx-auto grid max-w-[1240px] items-center gap-10 pb-12 pt-20 [grid-template-areas:'medal'_'info'_'bio'] md:pb-16 md:pt-24 lg:h-[800px] lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.25fr)_minmax(0,1.15fr)] lg:gap-6 lg:[grid-template-areas:'bio_medal_info']">
                <div className={cn("transition-[opacity,transform,filter] duration-500 [grid-area:bio] lg:max-w-[300px] lg:self-end lg:pb-6", isLeaving && "-translate-x-3 opacity-0 blur-sm")}>
                    {author ? (
                        <>
                            <p className="eyebrow mb-4 [text-shadow:0_1px_10px_rgb(0_0_0/0.85)]">{formatLifespan(author.born, author.died, t, author.approx)}</p>
                            <p className="font-serif text-[18.5px] leading-relaxed [text-shadow:0_1px_14px_rgb(0_0_0/0.75)]">{pick(author.bio)}</p>
                        </>
                    ) : isLoading && <><Skeleton className="mb-4 h-3 w-32"/><Skeleton className="h-24"/></>}
                </div>

                <div className="relative mx-auto aspect-[4/5] w-[min(440px,80vw)] [grid-area:medal] lg:-mb-16 lg:w-full lg:max-w-[500px] [perspective:1400px]">
                    <div aria-hidden className="absolute inset-x-[8%] top-[6%] aspect-square rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_16%,transparent),transparent_65%)] blur-2xl"/>
                    <svg viewBox="0 0 500 500" aria-hidden className="animate-spin-slow absolute left-[2%] top-[-2%] w-[96%] opacity-80">
                        <defs><path id="spotlight-ring" d="M250,250 m-232,0 a232,232 0 1,1 464,0 a232,232 0 1,1 -464,0"/></defs>
                        <text className="fill-accent text-[12.5px] font-medium tracking-[5px]">
                            <textPath href="#spotlight-ring">{author ? `${upper(name, language)} · ${formatLifespan(author.born, author.died, t)} · ${upper(pick(author.movement), language)} · ${upper(t("common:brand.name"), language)} ·` : ""}</textPath>
                        </text>
                    </svg>
                    <div ref={coinRef} className={cn("absolute inset-0 drop-shadow-[0_24px_40px_rgb(0_0_0/0.55)] transition-[transform,opacity,filter,translate] duration-500 ease-[var(--ease-out)] [transform:rotateY(var(--ry,0deg))_rotateX(var(--rx,0deg))]", isLeaving && "-translate-x-8 opacity-0 blur-md")}>
                        {!author ? <Skeleton className="mx-auto mt-[10%] aspect-square w-[80%] rounded-full"/> : author.portrait ? (
                            <Bust src={author.portrait} alt={name} priority className="animate-[hover-float_9s_ease-in-out_infinite] absolute inset-x-0 bottom-0 mx-auto h-full w-full"/>
                        ) : (
                            <Medallion size="lg" letter={letter} alt={name} className="mx-auto mt-[10%] w-[80%]"/>
                        )}
                    </div>
                </div>

                <div className={cn("min-w-0 [grid-area:info] lg:max-w-[520px]")}>
                    {/* A fixed slot on desktop, filled from the bottom: one-line and two-line names, short and long quotes all leave the
                        carousel below in the same place. */}
                    <div aria-live="polite" className={cn("transition-[opacity,transform,filter] duration-500 lg:flex lg:h-[29rem] lg:flex-col lg:justify-end", isLeaving && "translate-y-3 opacity-0 blur-sm")}>
                        {author ? (
                            <>
                                <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-muted-foreground">{pick(author.movement)}</p>
                                <h1 className="mb-6 mt-2.5 font-display text-[clamp(52px,6.4vw,88px)] font-medium leading-[0.95] tracking-[-0.01em] [text-wrap:balance]">
                                    <Link to={buildRoute.author(author.id)} className="outline-none transition-colors hover:text-accent-bright focus-visible:text-accent-bright">{name}</Link>
                                </h1>
                                {author.quote && (
                                    <figure>
                                        <blockquote lang={author.quote.lang} className="font-serif text-[clamp(21px,2vw,26px)] leading-snug">“{author.quote.text}”</blockquote>
                                        {author.quote.lang !== language && <figcaption className="mt-4 font-serif text-[17px] italic text-muted-foreground">({pick(author.quote.translation)})</figcaption>}
                                    </figure>
                                )}
                            </>
                        ) : isLoading && <><Skeleton className="h-3 w-28"/><Skeleton className="mt-4 h-20 w-4/5"/><Skeleton className="mt-6 h-16"/></>}
                    </div>

                    <div className="mt-10 flex items-center gap-3">
                        <button type="button" onClick={() => go(index - 1)} aria-label={t("spotlight.prev")} className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-muted-foreground/60 outline-none transition-all duration-300 hover:scale-110 hover:border-accent hover:text-accent-bright focus-visible:ring-2 focus-visible:ring-ring/60">
                            <ChevronLeft className="size-4"/>
                        </button>
                        <div ref={stripRef} className="relative flex min-w-0 flex-1 snap-x gap-1.5 overflow-x-auto py-1 [scrollbar-width:none]" role="tablist">
                            {authors.map((item, itemIndex) => {
                                const itemName = pick(item.name);
                                const isActive = itemIndex === index;
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        role="tab"
                                        aria-selected={isActive}
                                        aria-label={t("spotlight.show", {name: itemName})}
                                        onClick={() => go(itemIndex)}
                                        className={cn(
                                            "group/thumb grid w-[76px] shrink-0 cursor-pointer snap-start justify-items-center gap-1.5 rounded-md border p-2 outline-none transition-[background-color,border-color,transform] duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring/60",
                                            isActive ? "border-accent/30 bg-foreground/[0.07]" : "border-transparent",
                                        )}
                                    >
                                        <span className={cn("flex h-[60px] w-full items-end justify-center transition-[filter] duration-300", !isActive && "brightness-[0.6] grayscale-[0.4] group-hover/thumb:brightness-100 group-hover/thumb:grayscale-0")}>
                                            {item.portrait
                                                ? <Bust src={item.portrait} alt="" className="h-full w-auto"/>
                                                : <Medallion letter={surname(itemName)[0]} className="w-[48px]"/>}
                                        </span>
                                        <span className="w-full truncate text-center text-[10px] font-medium tracking-wide text-muted-foreground">{surname(itemName)}</span>
                                    </button>
                                );
                            })}
                        </div>
                        <button type="button" onClick={() => go(index + 1)} aria-label={t("spotlight.next")} className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-muted-foreground/60 outline-none transition-all duration-300 hover:scale-110 hover:border-accent hover:text-accent-bright focus-visible:ring-2 focus-visible:ring-ring/60">
                            <ChevronRight className="size-4"/>
                        </button>
                    </div>
                    <div className="relative mt-4 h-px bg-accent/25">
                        {authors.length > 0 && (
                            <span
                                key={index}
                                onAnimationEnd={() => go(index + 1)}
                                className="absolute -top-px left-0 h-[2px] w-full origin-left bg-accent"
                                style={{animation: `progress-fill ${SPOTLIGHT_INTERVAL_MS}ms linear forwards`, animationPlayState: isPaused ? "paused" : "running"} as CSSProperties}
                            />
                        )}
                    </div>
                    {author && (
                        <Link to={buildRoute.author(author.id)} className="group mt-6 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.16em] text-accent outline-none hover:text-accent-bright focus-visible:underline">
                            {t("works.more")}
                            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1"/>
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
};
