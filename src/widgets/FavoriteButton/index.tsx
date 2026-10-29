import {Heart} from "lucide-react";
import {useTranslation} from "react-i18next";
import {favoriteActions, useFavorites} from "@/hooks/useFavorites";
import {cn} from "@/lib/utils";

type FavoriteButtonProps = {
    bookId: string;
    className?: string;
    /** "overlay" sits on a cover; "outline" is the bordered button on the book page. */
    variant?: "overlay" | "outline";
};

/** A heart that saves the book to the visitor's shelf. It fills and pops when saved. */
export const FavoriteButton = ({bookId, className, variant = "overlay"}: FavoriteButtonProps) => {
    const {t} = useTranslation();
    const {isFavorite} = useFavorites();
    const active = isFavorite(bookId);
    const label = t(active ? "actions.removeFavorite" : "actions.addFavorite");

    return (
        <button
            type="button"
            aria-pressed={active}
            aria-label={label}
            title={label}
            onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                favoriteActions.toggle(bookId);
            }}
            className={cn(
                "flex cursor-pointer items-center justify-center rounded-full outline-none transition-[background-color,border-color,color,transform] duration-200 focus-visible:ring-2 focus-visible:ring-ring/60 active:scale-90",
                variant === "overlay"
                    ? "size-9 bg-background/70 text-foreground backdrop-blur-sm hover:bg-background/90"
                    : "size-12 border border-border-strong hover:border-accent hover:text-accent-bright",
                active && "text-accent-bright",
                className,
            )}
        >
            <Heart key={String(active)} className={cn("size-[18px] stroke-[1.6]", active && "animate-icon-pop fill-current")}/>
        </button>
    );
};
