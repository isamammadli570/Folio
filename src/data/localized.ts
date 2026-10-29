import type {Localized} from "@/api/types";

/** Builds a value in all three site languages, in AZ, EN, RU order. */
export const l = (az: string, en: string, ru: string): Localized => ({az, en, ru});
