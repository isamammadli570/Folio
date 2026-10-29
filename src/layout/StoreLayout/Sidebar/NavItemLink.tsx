import {memo, type CSSProperties} from "react";
import {Link} from "react-router";
import {useTranslation} from "react-i18next";
import {ActiveOrnament} from "@/layout/StoreLayout/Sidebar/ActiveOrnament";
import {preloadRoute} from "@/router/preload";
import type {NavItem} from "@/constants/sidebar";
import {cn} from "@/lib/utils";

type NavItemLinkProps = {
    item: NavItem;
    index: number;
    isActive: boolean;
    badge?: number;
    onNavigate?: () => void;
};

/** One sidebar tab. The selected one sits in a double-lined gold frame with a swirl on the right; its icon pops in. */
export const NavItemLink = memo(({item, index, isActive, badge, onNavigate}: NavItemLinkProps) => {
    const {t} = useTranslation();
    const Icon = item.icon;

    return (
        <li style={{"--i": index} as CSSProperties}>
            <Link
                to={item.to}
                onClick={onNavigate}
                onPointerEnter={() => preloadRoute(item.to)}
                onFocus={() => preloadRoute(item.to)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                    "group/item relative flex h-11 items-center gap-3 rounded-xl px-3 text-[14.5px] font-medium outline-none transition-[background-color,color] duration-200 focus-visible:ring-2 focus-visible:ring-brand/40",
                    isActive ? "text-brand-ink" : "text-sidebar-muted hover:bg-brand-soft/60 hover:text-brand-ink",
                )}
            >
                {isActive && (
                    <span aria-hidden className="animate-tab-in pointer-events-none absolute inset-0 rounded-xl border border-brand/70 bg-brand-soft shadow-[inset_0_0_0_2px_color-mix(in_srgb,var(--brand)_10%,transparent)]"/>
                )}
                <Icon className={cn("relative size-[18px] shrink-0 stroke-[1.5] transition-colors duration-200 group-hover/item:[animation:icon-wiggle_0.5s_ease-in-out]", isActive ? "animate-icon-pop text-brand" : "group-hover/item:text-brand")}/>
                <span className="relative min-w-0 flex-1 truncate">{t(item.labelKey as never)}</span>
                {isActive && <ActiveOrnament/>}
                {badge !== undefined && badge > 0 && !isActive && (
                    <span className="tabular relative flex h-5 min-w-5 items-center justify-center rounded-full border border-sidebar-border px-1.5 text-[11px] text-sidebar-muted">{badge}</span>
                )}
            </Link>
        </li>
    );
});
