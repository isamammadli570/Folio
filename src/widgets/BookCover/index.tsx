import {memo, type CSSProperties} from "react";
import {useTranslation} from "react-i18next";
import type {Author, Book} from "@/api/types";
import {CATEGORY_COLOR} from "@/constants/catalog";
import {useLanguage} from "@/hooks/useLanguage";
import {surname, upper} from "@/helpers/format";
import {OrnamentIcon} from "@/widgets/BookCover/ornaments";
import {cn} from "@/lib/utils";

type BookCoverProps = {
    book: Pick<Book, "title" | "category" | "ornament" | "coverImage">;
    author: Pick<Author, "name">;
    className?: string;
    /** Above the fold: load a real cover image eagerly. */
    priority?: boolean;
};

/**
 * A "Folio Classics" cover: cloth in the category colour, a double gold frame, the author's surname, an emblem and the
 * title in the current language. It is drawn, not an image, so it stays sharp at any size and follows the language.
 * A book that carries `coverImage` (a photo of a real edition) shows that instead.
 */
export const BookCover = memo(({book, author, className, priority = false}: BookCoverProps) => {
    const {t} = useTranslation();
    const {language, pick} = useLanguage();
    const title = pick(book.title);

    if (book.coverImage) {
        return (
            <div className={cn("book-cover", className)}>
                <img src={book.coverImage} alt={title} loading={priority ? "eager" : "lazy"} className="absolute inset-0 size-full object-cover"/>
            </div>
        );
    }

    return (
        <div role="img" aria-label={title} className={cn("book-cover", className)} style={{"--cloth": CATEGORY_COLOR[book.category]} as CSSProperties}>
            <div className="book-cover__frame">
                <span className="book-cover__author">{upper(surname(pick(author.name)), language)}</span>
                <span className="book-cover__middle">
                    <OrnamentIcon name={book.ornament} className="book-cover__emblem"/>
                    <span className="book-cover__title">{title}</span>
                    <span className="book-cover__rule"/>
                </span>
                <span className="book-cover__imprint">{upper(t("brand.name"), language)} · {upper(t(`categories.${book.category}`), language)}</span>
            </div>
        </div>
    );
});
