import {useState, type ReactNode} from "react";
import {ChevronDown} from "lucide-react";
import {useTranslation} from "react-i18next";
import type {NavGroup} from "@/constants/sidebar";
import {cn} from "@/lib/utils";

type NavGroupSectionProps = {
    group: NavGroup;
    children: ReactNode;
};

/** A titled block of tabs. The title is a small dotted caption in spaced capitals; click it to fold the group. */
export const NavGroupSection = ({group, children}: NavGroupSectionProps) => {
    const {t} = useTranslation();
    const [isOpen, setIsOpen] = useState(true);

    return (
        <section className="flex flex-col">
            <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                aria-expanded={isOpen}
                className="group/header flex h-9 w-full cursor-pointer items-center gap-2 rounded-md px-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            >
                <span className="size-1 shrink-0 rounded-full bg-brand/70"/>
                <span className="flex-1 text-[10.5px] font-medium uppercase tracking-[0.2em] text-sidebar-muted transition-colors group-hover/header:text-brand-ink">{t(group.labelKey as never)}</span>
                <ChevronDown className={cn("size-3.5 text-sidebar-muted/70 transition-transform duration-300 ease-out", !isOpen && "-rotate-90")}/>
            </button>
            <div className={cn("grid transition-[grid-template-rows] duration-300 ease-out", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                <div className="min-h-0 overflow-hidden">
                    <ul className="stagger flex flex-col gap-1 pb-3 pt-0.5">{children}</ul>
                </div>
            </div>
        </section>
    );
};
