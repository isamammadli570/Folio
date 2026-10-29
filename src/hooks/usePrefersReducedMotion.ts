import {useMediaQuery} from "@/hooks/_shared/useMediaQuery";

export const usePrefersReducedMotion = (): boolean => useMediaQuery("(prefers-reduced-motion: reduce)");
