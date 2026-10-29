import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {getBook, getBooks, getCategoryCounts, getPriceRange, type BookListParams} from "@/api/books.api";
import {QUERY_KEYS} from "@/constants/other";
import {useLanguage} from "@/hooks/useLanguage";
import {queryErrorMeta} from "@/hooks/_shared/queryErrorMeta";

/** Books matching the given filters, sorted in the current language. The previous list stays on screen while a new one loads. */
export const useGetBooks = (params: Omit<BookListParams, "language"> = {}, enabled = true) => {
    const {language} = useLanguage();
    const query = useQuery({
        queryKey: [QUERY_KEYS.BOOKS, language, params],
        queryFn: () => getBooks({...params, language}),
        placeholderData: keepPreviousData,
        enabled,
        meta: queryErrorMeta(),
    });
    return {...query, items: query.data ?? []};
};

export const useGetBook = (bookId: string | undefined) =>
    useQuery({
        queryKey: [QUERY_KEYS.BOOK, bookId],
        queryFn: () => getBook(bookId ?? ""),
        enabled: Boolean(bookId),
        meta: {suppressGlobalError: true},
    });

export const useGetCategoryCounts = () =>
    useQuery({queryKey: [QUERY_KEYS.CATEGORY_COUNTS], queryFn: getCategoryCounts, staleTime: Infinity});

export const useGetPriceRange = () =>
    useQuery({queryKey: [QUERY_KEYS.BOOKS, "priceRange"], queryFn: getPriceRange, staleTime: Infinity});
