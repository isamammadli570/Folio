import {useState} from "react";
import {Star} from "lucide-react";
import {useTranslation} from "react-i18next";
import {cn} from "@/lib/utils";

type StarsProps = {
    /** 0–5; halves and other fractions fill the last star partly. */
    value: number;
    className?: string;
    /** Size of one star in px. */
    size?: number;
};

/** Five gold stars, filled to the rating. Read-only; the count or number beside it is the caller's. */
export const Stars = ({value, className, size = 14}: StarsProps) => {
    const {t} = useTranslation("catalog");
    return (
        <span role="img" aria-label={t("reviews.ratingLabel", {value: value.toFixed(1)})} className={cn("relative inline-flex", className)}>
            <span className="flex text-border-strong">{[0, 1, 2, 3, 4].map((index) => <Star key={index} style={{width: size, height: size}} className="stroke-[1.5]"/>)}</span>
            <span className="absolute inset-0 flex overflow-hidden text-accent-bright" style={{width: `${(Math.max(0, Math.min(5, value)) / 5) * 100}%`}}>
                {[0, 1, 2, 3, 4].map((index) => <Star key={index} style={{width: size, height: size}} className="shrink-0 fill-current stroke-[1.5]"/>)}
            </span>
        </span>
    );
};

type StarPickerProps = {
    value: number;
    onChange: (value: number) => void;
};

/** Choosing 1–5 stars: a radio group, so keyboard arrows work; hovering previews the choice. */
export const StarPicker = ({value, onChange}: StarPickerProps) => {
    const {t} = useTranslation("catalog");
    const [hover, setHover] = useState(0);
    const shown = hover || value;

    return (
        <div role="radiogroup" aria-label={t("reviews.yourRating")} className="flex gap-1" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    role="radio"
                    aria-checked={value === star}
                    aria-label={t("reviews.stars", {count: star})}
                    onMouseEnter={() => setHover(star)}
                    onClick={() => onChange(star)}
                    className="cursor-pointer rounded-sm p-0.5 text-accent-bright outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                    <Star className={cn("size-7 stroke-[1.4] transition-colors", star <= shown ? "fill-current" : "text-border-strong")}/>
                </button>
            ))}
        </div>
    );
};
