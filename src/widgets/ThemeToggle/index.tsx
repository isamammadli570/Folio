import {Moon, Sun} from "lucide-react";
import {useTranslation} from "react-i18next";
import {originOf, useTheme} from "@/hooks/useTheme";
import {cn} from "@/lib/utils";

type ThemeToggleProps = {
    className?: string;
};

/** A sun and a moon that trade places when the reader switches between the dark hall and daylight. */
export const ThemeToggle = ({className}: ThemeToggleProps) => {
    const {t} = useTranslation();
    const {theme, toggle} = useTheme();
    const isDark = theme === "dark";

    return (
        <button
            type="button"
            onClick={(event) => toggle(originOf(event.currentTarget))}
            aria-label={t(isDark ? "header.lightTheme" : "header.darkTheme")}
            title={t(isDark ? "header.lightTheme" : "header.darkTheme")}
            className={cn(
                "relative flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border text-foreground outline-none transition-[border-color,background-color] duration-200 hover:border-accent hover:bg-accent-soft focus-visible:ring-2 focus-visible:ring-ring/60 [&_svg]:size-[18px] [&_svg]:stroke-[1.5]",
                className,
            )}
        >
            <Moon className={cn("absolute transition-[transform,opacity] duration-500 ease-[var(--ease-out)]", isDark ? "rotate-0 opacity-100" : "-rotate-90 translate-y-6 opacity-0")}/>
            <Sun className={cn("absolute transition-[transform,opacity] duration-500 ease-[var(--ease-out)]", isDark ? "rotate-90 translate-y-6 opacity-0" : "rotate-0 opacity-100")}/>
        </button>
    );
};
