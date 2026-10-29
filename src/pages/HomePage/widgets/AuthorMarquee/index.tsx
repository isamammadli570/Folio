import {Link} from "react-router";
import {useTranslation} from "react-i18next";
import type {AuthorSummary} from "@/api/authors.api";
import {buildRoute} from "@/constants/routes";
import {useLanguage} from "@/hooks/useLanguage";
import {surname} from "@/helpers/format";
import {Bust} from "@/widgets/Bust";
import {Medallion} from "@/widgets/Medallion";
import {cn} from "@/lib/utils";

type AuthorMarqueeProps = {
    authors: AuthorSummary[];
};

type RowProps = {
    authors: AuthorSummary[];
    reverse?: boolean;
    outlined?: boolean;
};

/** One endless row. The second copy of the run is for the eye only: hidden from screen readers and the keyboard. */
const Row = ({authors, reverse = false, outlined = false}: RowProps) => {
    const {pick} = useLanguage();

    const item = (author: AuthorSummary, isCopy: boolean) => {
        const name = pick(author.name);
        const content = (
            <>
                <span className="flex size-12 shrink-0 items-end justify-center">
                    {author.portrait ? <Bust src={author.portrait} alt="" className="h-12 w-auto opacity-80 transition-opacity duration-300 group-hover/name:opacity-100"/> : <Medallion letter={surname(name)[0]} className="w-9 opacity-70"/>}
                </span>
                <span
                    className={cn(
                        "whitespace-nowrap font-display text-[clamp(30px,3.4vw,46px)] italic leading-none transition-colors duration-300",
                        outlined
                            ? "text-transparent [-webkit-text-stroke:1px_var(--muted-foreground)] group-hover/name:text-foreground group-hover/name:[-webkit-text-stroke:0]"
                            : "text-muted-foreground group-hover/name:text-accent-bright",
                    )}
                >
                    {name}
                </span>
                <span aria-hidden className="ml-4 size-2 rotate-45 border border-accent/60 transition-transform duration-500 group-hover/name:rotate-[225deg]"/>
            </>
        );
        const className = "group/name flex items-center gap-4 px-6";
        return isCopy
            ? <span key={`copy-${author.id}`} aria-hidden className={className}>{content}</span>
            : <Link key={author.id} to={buildRoute.author(author.id)} className={cn(className, "outline-none focus-visible:underline")}>{content}</Link>;
    };

    return (
        <div className="marquee overflow-hidden py-3">
            <div className={cn("marquee__track", reverse && "marquee__track--reverse")}>
                {authors.map((author) => item(author, false))}
                {authors.map((author) => item(author, true))}
            </div>
        </div>
    );
};

/**
 * The hall of names: two endless rows sliding in opposite directions, the upper one in solid italic, the lower one in
 * outlined letters that fill in under the pointer. Busts stand beside the names that have one. Hovering a row stops it.
 */
export const AuthorMarquee = ({authors}: AuthorMarqueeProps) => {
    const {t} = useTranslation();
    if (authors.length === 0) return <div className="h-[180px] border-y border-border bg-surface"/>;

    const half = Math.ceil(authors.length / 2);
    return (
        <section aria-label={t("nav.authors")} className="relative border-y border-border bg-surface py-6">
            <Row authors={authors.slice(0, half)}/>
            <div aria-hidden className="mx-auto my-2 h-px max-w-[1240px] bg-gradient-to-r from-transparent via-border-strong to-transparent"/>
            <Row authors={authors.slice(half)} reverse outlined/>
        </section>
    );
};
