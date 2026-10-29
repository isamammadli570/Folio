import type {CSSProperties} from "react";
import {Link} from "react-router";
import type {BookWithAuthor} from "@/api/types";
import {CATEGORY_COLOR} from "@/constants/catalog";
import {buildRoute} from "@/constants/routes";
import {useLanguage} from "@/hooks/useLanguage";
import {surname, upper} from "@/helpers/format";

type BookShelfProps = {
    books: BookWithAuthor[];
};

/** Spine size follows the book: thicker for long works, taller for big ones, within a range that still reads as a shelf. */
const spineSize = (pages: number) => ({
    width: Math.round(Math.min(64, Math.max(30, 22 + pages / 22))),
    height: Math.round(Math.min(270, Math.max(190, 170 + pages / 9))),
});

/**
 * The saved books standing on a shelf as spines: cloth in the section colour, gold bands, the title running up the
 * spine. They drop onto the ledge one after another; under the pointer a book slides up off the shelf.
 */
export const BookShelf = ({books}: BookShelfProps) => {
    const {language, pick} = useLanguage();

    return (
        <div className="relative">
            <div className="scroll-thin flex items-end gap-1.5 overflow-x-auto px-4 pb-0 pt-10 [scrollbar-width:thin]">
                {books.map((book, index) => {
                    const {width, height} = spineSize(book.pages);
                    const title = pick(book.title);
                    return (
                        <Link
                            key={book.id}
                            to={buildRoute.book(book.id)}
                            title={`${title} · ${pick(book.author.name)}`}
                            className="spine group relative flex shrink-0 flex-col items-center justify-between overflow-hidden rounded-t-[3px] py-3 outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
                            style={{width, height, "--cloth": CATEGORY_COLOR[book.category], "--i": index} as CSSProperties}
                        >
                            <span aria-hidden className="h-1.5 w-full border-y border-[#c3a06a]/70"/>
                            <span className="max-h-[70%] overflow-hidden text-ellipsis whitespace-nowrap font-serif text-[13px] leading-none text-[#e9d7b1] [writing-mode:vertical-rl] rotate-180">{title}</span>
                            <span className="flex flex-col items-center gap-2">
                                <span aria-hidden className="size-1.5 rotate-45 bg-[#c3a06a]"/>
                                <span className="text-[7.5px] font-medium tracking-[0.2em] text-[#e9d7b1]/80 [writing-mode:vertical-rl] rotate-180">{upper(surname(pick(book.author.name)), language)}</span>
                            </span>
                            <span aria-hidden className="h-1.5 w-full border-y border-[#c3a06a]/70"/>
                        </Link>
                    );
                })}
            </div>
            <div aria-hidden className="relative h-4 rounded-sm bg-gradient-to-b from-[#3a352b] to-[#1a1814] shadow-[0_18px_30px_-12px_rgb(var(--shade)/0.9)]">
                <span className="absolute inset-x-0 top-0 h-px bg-accent/50"/>
            </div>
        </div>
    );
};
