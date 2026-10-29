import {useMemo, useState} from "react";
import {Link, useNavigate} from "react-router";
import {ArrowRight, Search} from "lucide-react";
import {Dialog as DialogPrimitive} from "radix-ui";
import {useTranslation} from "react-i18next";
import {buildRoute} from "@/constants/routes";
import {useGetBooks} from "@/hooks/books";
import {useGetAuthors} from "@/hooks/authors";
import {useDebouncedValue} from "@/hooks/useDebouncedValue";
import {useLanguage} from "@/hooks/useLanguage";
import {normalizeSearch} from "@/helpers/catalog";
import {formatPrice, surname} from "@/helpers/format";
import {BookCover} from "@/widgets/BookCover";
import {Medallion} from "@/widgets/Medallion";

type SearchDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

/** Quick search over titles and authors in all three languages; Enter opens the full catalogue results. */
export const SearchDialog = ({open, onOpenChange}: SearchDialogProps) => {
    const {t} = useTranslation();
    const {language, pick} = useLanguage();
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const debounced = useDebouncedValue(query.trim(), 180);
    const {items: books, isFetching} = useGetBooks({query: debounced, limit: 6}, open && debounced.length > 0);
    const {items: allAuthors} = useGetAuthors();

    const authors = useMemo(() => {
        const needle = normalizeSearch(debounced);
        if (!needle) return [];
        return allAuthors.filter((author) => Object.values(author.name).some((name) => normalizeSearch(name).includes(needle))).slice(0, 4);
    }, [allAuthors, debounced]);

    const close = () => onOpenChange(false);
    const hasQuery = debounced.length > 0;
    const isEmpty = hasQuery && !isFetching && books.length === 0 && authors.length === 0;

    return (
        <DialogPrimitive.Root open={open} onOpenChange={(next) => { onOpenChange(next); if (!next) setQuery(""); }}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/65 backdrop-blur-[3px] data-[state=open]:animate-fade-in"/>
                <DialogPrimitive.Content className="fixed left-1/2 top-[max(1rem,10vh)] z-50 w-[min(42rem,calc(100%-2rem))] -translate-x-1/2 overflow-hidden rounded-xl border border-border-strong bg-surface shadow-2xl outline-none data-[state=open]:animate-scale-in">
                    <DialogPrimitive.Title className="sr-only">{t("search.title")}</DialogPrimitive.Title>
                    <DialogPrimitive.Description className="sr-only">{t("search.hint")}</DialogPrimitive.Description>
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            if (!query.trim()) return;
                            close();
                            void navigate(buildRoute.catalog({q: query.trim()}));
                        }}
                        className="flex items-center gap-3 border-b border-border px-5"
                    >
                        <Search className="size-5 shrink-0 stroke-[1.5] text-accent"/>
                        <input
                            id="site-search"
                            autoFocus
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder={t("search.placeholder")}
                            autoComplete="off"
                            className="h-16 min-w-0 flex-1 bg-transparent font-serif text-xl outline-none placeholder:text-faint-foreground"
                        />
                    </form>

                    <div className="scroll-thin max-h-[min(60vh,32rem)] overflow-y-auto p-2">
                        {!hasQuery && <p className="px-3 py-6 text-center text-sm text-muted-foreground">{t("search.hint")}</p>}
                        {isEmpty && <p className="px-3 py-6 text-center text-sm text-muted-foreground">{t("search.empty", {query: debounced})}</p>}

                        {authors.length > 0 && (
                            <section className="pb-2">
                                <p className="px-3 pb-1 pt-2 text-[10.5px] font-medium uppercase tracking-[0.2em] text-faint-foreground">{t("search.authors")}</p>
                                {authors.map((author) => (
                                    <Link key={author.id} to={buildRoute.author(author.id)} onClick={close} className="flex items-center gap-3 rounded-lg px-3 py-2 outline-none hover:bg-muted focus-visible:bg-muted">
                                        <Medallion letter={surname(pick(author.name))[0]} className="w-9"/>
                                        <span className="min-w-0">
                                            <span className="block truncate font-serif text-[17px]">{pick(author.name)}</span>
                                            <span className="block truncate text-xs text-muted-foreground">{pick(author.movement)}</span>
                                        </span>
                                    </Link>
                                ))}
                            </section>
                        )}

                        {books.length > 0 && (
                            <section>
                                <p className="px-3 pb-1 pt-2 text-[10.5px] font-medium uppercase tracking-[0.2em] text-faint-foreground">{t("search.books")}</p>
                                {books.map((book) => (
                                    <Link key={book.id} to={buildRoute.book(book.id)} onClick={close} className="grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-3 rounded-lg px-3 py-2 outline-none hover:bg-muted focus-visible:bg-muted">
                                        <BookCover book={book} author={book.author}/>
                                        <span className="min-w-0">
                                            <span className="block truncate font-serif text-[17px]">{pick(book.title)}</span>
                                            <span className="block truncate text-xs text-muted-foreground">{pick(book.author.name)}</span>
                                        </span>
                                        <span className="tabular text-sm text-accent-bright">{formatPrice(book.price, language)}</span>
                                    </Link>
                                ))}
                                <button type="submit" onClick={() => { close(); void navigate(buildRoute.catalog({q: debounced})); }} className="mt-1 flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-3 text-sm text-accent outline-none hover:bg-muted focus-visible:bg-muted">
                                    {t("search.allResults")}
                                    <ArrowRight className="size-4"/>
                                </button>
                            </section>
                        )}
                    </div>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
};
