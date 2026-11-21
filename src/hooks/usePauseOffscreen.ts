import {useCallback} from "react";

/**
 * Marks the element `data-paused` while it is scrolled out of view, which pauses every CSS animation inside it (see
 * index.css). For sections with endless decoration (motes, turning rings, marquees): off screen they cost nothing.
 * A callback ref, so it also works for an element that appears only after its data has loaded.
 */
export const usePauseOffscreen = <TElement extends HTMLElement>() =>
    useCallback((element: TElement | null) => {
        if (!element || typeof IntersectionObserver === "undefined") return;
        const observer = new IntersectionObserver(
            ([entry]) => element.toggleAttribute("data-paused", !entry.isIntersecting),
            {rootMargin: "120px 0px"},
        );
        observer.observe(element);
        return () => observer.disconnect();
    }, []);
