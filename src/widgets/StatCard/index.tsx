import type {CSSProperties, ReactNode} from "react";
import {cn} from "@/lib/utils";

type StatCardProps = {
    label: string;
    value: ReactNode;
    hint?: ReactNode;
    icon: ReactNode;
    index?: number;
    className?: string;
};

/** One figure on the dashboard: a caption in spaced capitals, the number in large serif, a line of context under it. */
export const StatCard = ({label, value, hint, icon, index = 0, className}: StatCardProps) => (
    <div
        className={cn("animate-fade-up relative overflow-hidden rounded-xl border border-border bg-surface p-5", className)}
        style={{animationDelay: `${index * 70}ms`} as CSSProperties}
    >
        <span aria-hidden className="absolute -right-6 -top-6 size-24 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_14%,transparent),transparent_70%)]"/>
        <div className="flex items-center justify-between gap-3">
            <p className="text-[10.5px] font-medium uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
            <span className="text-accent [&_svg]:size-[18px] [&_svg]:stroke-[1.4]">{icon}</span>
        </div>
        <p className="tabular mt-4 font-serif text-[34px] leading-none">{value}</p>
        {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
    </div>
);
