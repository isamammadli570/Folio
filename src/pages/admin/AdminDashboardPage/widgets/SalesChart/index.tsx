import {useState} from "react";
import {useTranslation} from "react-i18next";
import type {DaySales} from "@/helpers/admin";
import {formatDay, formatPrice} from "@/helpers/format";
import {useLanguage} from "@/hooks/useLanguage";
import {cn} from "@/lib/utils";

type SalesChartProps = {
    days: DaySales[];
};

/**
 * Daily sales as thin accent bars on a recessive baseline. One series, so the title names it and there is no legend;
 * hovering (or focusing) a day shows its total and order count. Every fourth day is labelled to keep the axis quiet.
 */
export const SalesChart = ({days}: SalesChartProps) => {
    const {t} = useTranslation("admin");
    const {language} = useLanguage();
    const [active, setActive] = useState<number | null>(null);
    const max = Math.max(...days.map((day) => day.total), 1);
    const label = (day: string) => formatDay(`${day}T12:00:00`, language);
    const current = active === null ? null : days[active];

    return (
        <div className="rounded-xl border border-border bg-surface p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-[10.5px] font-medium uppercase tracking-[0.2em] text-muted-foreground">{t("dashboard.salesTitle", {count: days.length})}</p>
                <p className="tabular text-sm text-muted-foreground" aria-live="polite">
                    {current ? <><span className="text-foreground">{label(current.day)}</span> · {formatPrice(current.total, language)} · {t("dashboard.ordersCount", {count: current.count})}</> : t("dashboard.salesHint")}
                </p>
            </div>
            <div className="relative mt-6 h-44" onMouseLeave={() => setActive(null)}>
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-border-strong"/>
                <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-border/60"/>
                <span aria-hidden className="tabular absolute right-0 top-1 text-[10px] text-faint-foreground">{formatPrice(max, language)}</span>
                <ol className="absolute inset-0 flex items-end gap-[2px]">
                    {days.map((day, index) => (
                        <li key={day.day} className="flex h-full min-w-0 flex-1 items-end">
                            <button
                                type="button"
                                onMouseEnter={() => setActive(index)}
                                onFocus={() => setActive(index)}
                                onBlur={() => setActive(null)}
                                aria-label={`${label(day.day)}: ${formatPrice(day.total, language)}`}
                                className="group flex h-full w-full cursor-default items-end justify-center outline-none"
                            >
                                <span
                                    className={cn(
                                        "animate-grow-bar block w-full max-w-7 origin-bottom rounded-t-[4px] transition-colors duration-200",
                                        day.total > 0 ? "bg-accent/55 group-hover:bg-accent group-focus-visible:bg-accent" : "bg-border",
                                        active === index && "bg-accent",
                                    )}
                                    style={{height: day.total > 0 ? `${Math.max(3, (day.total / max) * 100)}%` : "2px", animationDelay: `${index * 25}ms`}}
                                />
                            </button>
                        </li>
                    ))}
                </ol>
            </div>
            <div aria-hidden className="mt-2 flex gap-[2px] text-[10px] text-faint-foreground">
                {days.map((day, index) => <span key={day.day} className="min-w-0 flex-1 truncate text-center">{index % 4 === 0 || index === days.length - 1 ? label(day.day) : ""}</span>)}
            </div>
        </div>
    );
};
