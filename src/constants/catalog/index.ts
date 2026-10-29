export const CATEGORY = {
    Philosophy: "philosophy",
    History: "history",
    Psychology: "psychology",
    Literature: "literature",
} as const;

export type CategoryId = (typeof CATEGORY)[keyof typeof CATEGORY];

export const CATEGORY_IDS: CategoryId[] = Object.values(CATEGORY);

/** Cloth colour of each category: the book covers and category accents use it. Values are CSS variables from index.css. */
export const CATEGORY_COLOR: Record<CategoryId, string> = {
    philosophy: "var(--cat-philosophy)",
    history: "var(--cat-history)",
    psychology: "var(--cat-psychology)",
    literature: "var(--cat-literature)",
};

export const ORNAMENTS = ["column", "star", "laurel", "sun", "quill", "compass", "amphora", "eye", "key"] as const;
export type Ornament = (typeof ORNAMENTS)[number];

/** The emblem drawn for each category on its tile. */
export const CATEGORY_ORNAMENT: Record<CategoryId, Ornament> = {
    philosophy: "column",
    history: "amphora",
    psychology: "eye",
    literature: "quill",
};

export const SORT = {
    Featured: "featured",
    PriceAsc: "price-asc",
    PriceDesc: "price-desc",
    Title: "title",
    Oldest: "oldest",
    Newest: "newest",
} as const;

export type SortId = (typeof SORT)[keyof typeof SORT];

export const SORT_IDS: SortId[] = Object.values(SORT);

/** Historical periods for the catalog filter, by year of first publication. */
export const PERIOD = {
    Ancient: "ancient",
    Medieval: "medieval",
    Modern: "modern",
    Contemporary: "contemporary",
} as const;

export type PeriodId = (typeof PERIOD)[keyof typeof PERIOD];

export const PERIOD_IDS: PeriodId[] = Object.values(PERIOD);

/** Inclusive year ranges; negative years are BCE. */
export const PERIOD_RANGE: Record<PeriodId, [number, number]> = {
    ancient: [-Infinity, 499],
    medieval: [500, 1499],
    modern: [1500, 1899],
    contemporary: [1900, Infinity],
};
