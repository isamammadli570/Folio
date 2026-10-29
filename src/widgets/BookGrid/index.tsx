import type {BookWithAuthor} from "@/api/types";
import {Skeleton} from "@/components/ui/skeleton";
import {BookCard} from "@/widgets/BookCard";
import {cn} from "@/lib/utils";

const GRID = "grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-7 sm:gap-y-14 md:grid-cols-3 xl:grid-cols-4";

type BookGridProps = {
    books: BookWithAuthor[];
    className?: string;
};

/** Books on a responsive shelf, entering one after another. */
export const BookGrid = ({books, className}: BookGridProps) => (
    <div className={cn(GRID, "stagger", className)}>
        {books.map((book, index) => <BookCard key={book.id} book={book} index={index}/>)}
    </div>
);

type BookGridSkeletonProps = {
    count?: number;
    className?: string;
};

/** Placeholder covers and caption lines in the shape of the grid. */
export const BookGridSkeleton = ({count = 8, className}: BookGridSkeletonProps) => (
    <div aria-hidden className={cn(GRID, className)}>
        {Array.from({length: count}, (_, index) => (
            <div key={index}>
                <Skeleton className="aspect-[2/3] rounded-[2px_5px_5px_2px]"/>
                <Skeleton className="mt-4 h-5 w-4/5"/>
                <Skeleton className="mt-2 h-3.5 w-1/2"/>
            </div>
        ))}
    </div>
);
