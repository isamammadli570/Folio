import {BookOpen, BookMarked, LayoutDashboard, ReceiptText, Store, UserRoundPen, Heart, Home, Landmark, Brain, Feather, MapPin, Package, Scroll, UserRound, Users, type LucideIcon} from "lucide-react";
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

/** Tabs of the account area. Keys are in the `account` namespace. */
export const ACCOUNT_LINKS: NavItem[] = [
    {labelKey: "account:nav.orders", to: ROUTES.ACCOUNT, icon: Package},
    {labelKey: "account:nav.addresses", to: ROUTES.ACCOUNT_ADDRESSES, icon: MapPin},
    {labelKey: "account:nav.profile", to: ROUTES.ACCOUNT_PROFILE, icon: UserRound},
    {labelKey: "account:nav.favorites", to: ROUTES.FAVORITES, icon: Heart},
];

/** The admin sidebar. Keys are in the `admin` namespace. */
export const ADMIN_NAV_GROUPS: NavGroup[] = [
    {
        id: "overview",
        labelKey: "admin:nav.groups.overview",
        items: [
            {labelKey: "admin:nav.dashboard", to: ROUTES.ADMIN, icon: LayoutDashboard},
            {labelKey: "admin:nav.orders", to: ROUTES.ADMIN_ORDERS, icon: ReceiptText},
        ],
    },
    {
        id: "catalogue",
        labelKey: "admin:nav.groups.catalogue",
        items: [
            {labelKey: "admin:nav.books", to: ROUTES.ADMIN_BOOKS, icon: BookMarked},
            {labelKey: "admin:nav.authors", to: ROUTES.ADMIN_AUTHORS, icon: UserRoundPen},
        ],
    },
    {
        id: "shop",
        labelKey: "admin:nav.groups.shop",
        items: [{labelKey: "admin:nav.storefront", to: ROUTES.HOME, icon: Store}],
    },
];
