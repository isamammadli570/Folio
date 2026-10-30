import {useMemo, type CSSProperties, type ReactNode} from "react";
import {Link, useParams} from "react-router";
import {ChevronRight} from "lucide-react";
import {useTranslation} from "react-i18next";
import {Skeleton} from "@/components/ui/skeleton";
import {buildRoute, ROUTES} from "@/constants/routes";
import {useGetAuthor, useGetAuthors} from "@/hooks/authors";
import {useGetBooks} from "@/hooks/books";
import {useLanguage} from "@/hooks/useLanguage";
import {formatLifespan, surname} from "@/helpers/format";
import {RouteErrorPage} from "@/router/RouteErrorPage";
import {BookGrid, BookGridSkeleton} from "@/widgets/BookGrid";
import {Bust} from "@/widgets/Bust";
import {Astrolabe} from "@/widgets/Astrolabe";
import {GoldDust} from "@/widgets/GoldDust";
import {Medallion} from "@/widgets/Medallion";
import {Reveal} from "@/widgets/Reveal";
import {SceneArc} from "@/widgets/SceneArc";
import {Timeline} from "@/widgets/Timeline";

const Stat = ({label, index, children}: {label: string; index: number; children: ReactNode}) => (
    <div className="border-l border-border pl-5" style={{"--i": index} as CSSProperties}>
        <p className="text-[10.5px] font-medium uppercase tracking-[0.22em] text-faint-foreground">{label}</p>
        <p className="mt-2 font-display text-[clamp(24px,2.4vw,32px)] font-medium leading-tight">{children}</p>
    </div>
);

/** Years two lives shared; zero or less when they never met in time. */
const overlap = (a: {born: number; died: number}, b: {born: number; died: number}): number => Math.min(a.died, b.died) - Math.max(a.born, b.born);

/**
 * An author's own hall. The hero repeats the home spotlight's language (the scene in the arc, the bust, the line in
 * the original tongue); below it the figures of a life, the works pinned on the timeline, the books, and the
 * contemporaries whose lives overlapped.
 */
export const AuthorPage = () => {
    const {authorId} = useParams();
    const {t} = useTranslation(["authors", "common"]);
    const {language, pick} = useLanguage();
    const {data: author, isLoading, isError} = useGetAuthor(authorId);
    const {items: books, isLoading: booksLoading} = useGetBooks({authorId, sort: "oldest"}, Boolean(author));
    const {items: everyone} = useGetAuthors();

    const contemporaries = useMemo(() => {
        if (!author) return [];
        return everyone
            .filter((other) => other.id !== author.id && overlap(author, other) > 0)
            .map((other) => ({author: other, years: overlap(author, other)}))
            .sort((a, b) => b.years - a.years)
            .slice(0, 6);
    }, [author, everyone]);

    if (isError) return <RouteErrorPage/>;

    const name = author ? pick(author.name) : "";
    const letter = surname(name)[0] ?? "";

    return (
        <div className="page-enter">
            <section className="relative isolate overflow-hidden border-b border-border bg-[radial-gradient(60%_70%_at_18%_45%,var(--hero-glow),transparent_70%),radial-gradient(50%_60%_at_55%_55%,var(--hero-glow-soft),transparent_70%)]">
                <SceneArc src={author?.scene} letter={letter}/>
                <Astrolabe className="-right-48 -top-48 w-[min(680px,95vw)] max-lg:opacity-60"/>
                <GoldDust className="absolute bottom-0 right-0 h-3/5 w-3/5" count={16} seed={11}/>

                <div className="px-gutter relative mx-auto max-w-[1240px] pb-0 pt-10">
                    <nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Link to={ROUTES.AUTHORS} className="hover:text-foreground">{t("common:nav.authors")}</Link>
                        <ChevronRight className="size-3"/>
                        <span aria-current="page" className="text-foreground">{name}</span>
                    </nav>

                    <div className="grid grid-cols-[minmax(0,1fr)] items-end gap-10 pt-8 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:gap-14 lg:min-h-[640px]">
                        <div className="relative mx-auto aspect-[4/5] w-[min(460px,82vw)] md:order-none md:w-full md:max-w-[480px]">
                            <div aria-hidden className="absolute inset-x-[8%] top-[6%] aspect-square rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_16%,transparent),transparent_65%)] blur-2xl"/>
                            {isLoading || !author ? <Skeleton className="mx-auto mt-[10%] aspect-square w-[80%] rounded-full"/> : author.portrait ? (
                                <div className="absolute inset-0 drop-shadow-[0_24px_40px_rgb(var(--shade)/0.55)]">
                                    <Bust src={author.portrait} alt={name} priority className="animate-fade-up absolute inset-0 size-full"/>
                                </div>
                            ) : (
                                <Medallion size="lg" letter={letter} alt={name} className="animate-scale-in mx-auto mt-[10%] w-[80%]"/>
                            )}
                        </div>

                        <div className="min-w-0 pb-16 md:pb-24">
                            {isLoading || !author ? (
                                <div className="space-y-5"><Skeleton className="h-3 w-40"/><Skeleton className="h-20 w-3/4"/><Skeleton className="h-24"/></div>
                            ) : (
                                <Reveal variant="stagger">
                                    <p className="eyebrow" style={{"--i": 0} as CSSProperties}>{formatLifespan(author.born, author.died, t, author.approx)} · {pick(author.movement)}</p>
                                    <h1 className="mt-4 font-display text-[clamp(52px,6.4vw,88px)] font-medium leading-[0.95] [text-wrap:balance]" style={{"--i": 1} as CSSProperties}>{name}</h1>
                                    <p className="mt-6 max-w-[56ch] font-serif text-[20px] leading-relaxed [text-shadow:0_1px_14px_var(--text-halo)]" style={{"--i": 2} as CSSProperties}>{pick(author.bio)}</p>
                                    {author.quote && (
                                        <figure className="mt-8 border-l border-accent/60 pl-6" style={{"--i": 3} as CSSProperties}>
                                            <blockquote lang={author.quote.lang} className="font-serif text-[clamp(21px,2vw,25px)] leading-snug">“{author.quote.text}”</blockquote>
                                            {author.quote.lang !== language && <figcaption className="mt-3 font-serif text-[17px] italic text-muted-foreground">({pick(author.quote.translation)})</figcaption>}
                                        </figure>
                                    )}
                                </Reveal>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <div className="px-gutter mx-auto max-w-[1240px] pb-24">
                {author && (
                    <Reveal variant="stagger" className="grid grid-cols-2 gap-y-8 py-14 lg:grid-cols-3">
                        <Stat label={t("statLived")} index={0}>{t("lived", {count: Math.abs(author.died - author.born)})}</Stat>
                        <Stat label={t("statWorks")} index={1}>{t("common:bookCount", {count: author.bookCount})}</Stat>
                        <Stat label={t("statMovement")} index={2}>{pick(author.movement)}</Stat>
                    </Reveal>
                )}

                {author && books.length > 0 && (
                    <Timeline
                        title={t("timeline")}
                        life={{born: author.born, died: author.died, label: `${t("life")} · ${formatLifespan(author.born, author.died, t, author.approx)}`}}
                        marks={books.map((book) => ({year: book.year, approx: book.approxYear, label: pick(book.title), href: buildRoute.book(book.id)}))}
                    />
                )}

                <Reveal as="section" className="pt-20">
                    <p className="eyebrow">{t("works")}</p>
                    <h2 className="mb-10 mt-3 font-serif text-[clamp(32px,4vw,48px)]">{author ? t("common:bookCount", {count: author.bookCount}) : " "}</h2>
                    {booksLoading || !author ? <BookGridSkeleton count={4}/> : <BookGrid books={books}/>}
                </Reveal>

                {contemporaries.length > 0 && (
                    <Reveal as="section" className="pt-24">
                        <p className="eyebrow">{t("contemporaries")}</p>
                        <h2 className="mt-3 font-serif text-[clamp(28px,3.4vw,40px)]">{t("contemporariesText", {name})}</h2>
                        <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
                            {contemporaries.map(({author: other, years}) => {
                                const otherName = pick(other.name);
                                return (
                                    <li key={other.id}>
                                        <Link to={buildRoute.author(other.id)} className="group flex flex-col items-center text-center outline-none">
                                            <span className="w-[70%] transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-1.5 group-hover:rotate-[-4deg]">
                                                <Medallion letter={surname(otherName)[0]} portrait={other.portrait} alt={otherName} className="w-full"/>
                                            </span>
                                            <span className="mt-5 font-serif text-lg leading-tight transition-colors group-hover:text-accent-bright">{otherName}</span>
                                            <span className="mt-1 text-xs text-muted-foreground">{t("overlap", {count: years})}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </Reveal>
                )}
            </div>
        </div>
    );
};
