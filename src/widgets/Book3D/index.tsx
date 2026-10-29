import {forwardRef, type CSSProperties} from "react";
import type {Author, Book} from "@/api/types";
import {CATEGORY_COLOR} from "@/constants/catalog";
import {useLanguage} from "@/hooks/useLanguage";
import {surname, upper} from "@/helpers/format";
import {BookCover} from "@/widgets/BookCover";
import {cn} from "@/lib/utils";

type Book3DProps = {
    book: Pick<Book, "id" | "title" | "category" | "ornament" | "coverImage" | "pages">;
    author: Pick<Author, "name">;
    className?: string;
};

/**
 * The book as an object: front cover, a cloth spine with its title, the block of pages and the back, built from CSS 3D
 * planes. Its thickness follows the page count. It rests turned to show the spine; a parent sets --rx/--ry to swing it.
 * The ref points at the front cover, so the fly-to-cart animation can copy it.
 */
export const Book3D = forwardRef<HTMLDivElement, Book3DProps>(({book, author, className}, ref) => {
    const {language, pick} = useLanguage();
    // As a share of the cover width, like a real book: a 250-page volume is about 14% as thick as it is wide.
    const depth = Math.min(26, Math.max(12.5, book.pages / 18)).toFixed(1);

    return (
        <div className={cn("book3d", className)} style={{"--depth": `${depth}cqi`, "--cloth": CATEGORY_COLOR[book.category]} as CSSProperties}>
            <div className="book3d__body">
                <div ref={ref} className="book3d__front">
                    <BookCover book={book} author={author} priority/>
                </div>
                <div aria-hidden className="book3d__spine">
                    <span className="book3d__band"/>
                    <span className="book3d__spine-title">{pick(book.title)}</span>
                    <span className="book3d__spine-author">{upper(surname(pick(author.name)), language)}</span>
                    <span className="book3d__band"/>
                </div>
                <div aria-hidden className="book3d__pages"/>
                <div aria-hidden className="book3d__top"/>
                <div aria-hidden className="book3d__back"/>
            </div>
        </div>
    );
});
