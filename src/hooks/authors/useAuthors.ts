import {useQuery} from "@tanstack/react-query";
import {getAuthor, getAuthors, getFeaturedAuthors} from "@/api/authors.api";
import {QUERY_KEYS} from "@/constants/other";
import {queryErrorMeta} from "@/hooks/_shared/queryErrorMeta";

export const useGetAuthors = () => {
    const query = useQuery({queryKey: [QUERY_KEYS.AUTHORS], queryFn: getAuthors, meta: queryErrorMeta()});
    return {...query, items: query.data ?? []};
};

export const useGetFeaturedAuthors = () => {
    const query = useQuery({queryKey: [QUERY_KEYS.AUTHORS, "featured"], queryFn: getFeaturedAuthors, meta: queryErrorMeta()});
    return {...query, items: query.data ?? []};
};

export const useGetAuthor = (authorId: string | undefined) =>
    useQuery({
        queryKey: [QUERY_KEYS.AUTHOR, authorId],
        queryFn: () => getAuthor(authorId ?? ""),
        enabled: Boolean(authorId),
        meta: {suppressGlobalError: true},
    });
