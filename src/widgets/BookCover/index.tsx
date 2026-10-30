import {memo, type CSSProperties} from "react";
import {useTranslation} from "react-i18next";
import type {Author, Book} from "@/api/types";
import {CATEGORY_COLOR} from "@/constants/catalog";
import {useLanguage} from "@/hooks/useLanguage";
import {surname, upper} from "@/helpers/format";
import {CoverFrame, Fleuron} from "@/widgets/BookCover/CoverFrame";
import {OrnamentIcon} from "@/widgets/BookCover/ornaments";
import {cn} from "@/lib/utils";

/** Long titles and long words are set smaller, so no word has to break across lines. */
const titleLength = (title: string): "long" | "longer" | undefined => {
    const longestWord = Math.max(...title.split(/\s+/).map((word) => word.length));
    if (title.length > 26 || longestWord > 13) return "longer";
    if (title.length > 15 || longestWord > 10) return "long";
    return undefined;
};

type BookCoverProps = {
    book: Pick<Book, "id" | "title" | "category" | "ornament" | "coverImage">;
    author: Pick<Author, "name">;
    className?: string;
    /** Above the fold: load the painting eagerly. */
    priority?: boolean;
};

/**
 * A "Folio Classics" binding: grained cloth in the category colour with a hinge by the spine, gilt fillets with
 * concave corners, and the author, title and imprint stamped in gold foil. A book with a painting shows it as a plate
 * in an arched window; the others carry their emblem in a gilt roundel. The lettering is drawn, not part of an image,
 * so it stays sharp at any size and follows the language.
 */
export const BookCover = memo(({book, author, className, priority = false}: BookCoverProps) => {
    const {t} = useTranslation();
    const {language, pick} = useLanguage();
    const title = pick(book.title);
    const art = book.coverImage;

    return (
        <div role="img" aria-label={title} className={cn("book-cover", className)} style={{"--cloth": CATEGORY_COLOR[book.category]} as CSSProperties}>
            <CoverFrame/>
            <div className={cn("book-cover__frame", art && "book-cover__frame--art")}>
                <span className="book-cover__author foil">{upper(surname(pick(author.name)), language)}</span>
                {art ? (
                    <>
                        <span className="book-cover__window">
                            <img src={art} alt="" loading={priority ? "eager" : "lazy"} decoding="async" draggable={false}/>
                        </span>
                        <span className="book-cover__title foil" data-length={titleLength(title)}>{title}</span>
                    </>
                ) : (
                    <span className="book-cover__middle">
                        <span className="book-cover__roundel"><OrnamentIcon name={book.ornament} className="book-cover__emblem"/></span>
                        <span className="book-cover__title foil" data-length={titleLength(title)}>{title}</span>
                        <Fleuron/>
                    </span>
                )}
                <span className="book-cover__imprint foil">{upper(t("brand.name"), language)} · {upper(t(`categories.${book.category}`), language)}</span>
            </div>
        </div>
    );
});
