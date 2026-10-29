import {BookOpen, Heart, Home, Landmark, Brain, Feather, Scroll, Users, type LucideIcon} from "lucide-react";
import {buildRoute, ROUTES} from "@/constants/routes";
import type {CategoryId} from "@/constants/catalog";

export type NavItem = {
    /** Key inside the `common` namespace. */
    labelKey: string;
    to: string;
    icon: LucideIcon;
    /** Category links show the number of books beside them. */
    category?: CategoryId;
};

export type NavGroup = {
    id: string;
    /** Key inside the `common` namespace. */
    labelKey: string;
    items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
    {
        id: "store",
        labelKey: "sidebar.groups.store",
        items: [
            {labelKey: "nav.home", to: ROUTES.HOME, icon: Home},
            {labelKey: "nav.books", to: ROUTES.CATALOG, icon: BookOpen},
            {labelKey: "nav.authors", to: ROUTES.AUTHORS, icon: Users},
            {labelKey: "nav.favorites", to: ROUTES.FAVORITES, icon: Heart},
        ],
    },
    {
        id: "categories",
        labelKey: "sidebar.groups.categories",
        items: [
            {labelKey: "categories.philosophy", to: buildRoute.catalog({category: "philosophy"}), icon: Landmark, category: "philosophy"},
            {labelKey: "categories.history", to: buildRoute.catalog({category: "history"}), icon: Scroll, category: "history"},
            {labelKey: "categories.psychology", to: buildRoute.catalog({category: "psychology"}), icon: Brain, category: "psychology"},
            {labelKey: "categories.literature", to: buildRoute.catalog({category: "literature"}), icon: Feather, category: "literature"},
        ],
    },
];

/** Links in the desktop header. */
export const HEADER_LINKS = [
    {labelKey: "nav.books", to: ROUTES.CATALOG},
    {labelKey: "nav.authors", to: ROUTES.AUTHORS},
] as const;
