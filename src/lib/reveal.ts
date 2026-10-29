type Callback = () => void;

const callbacks = new WeakMap<Element, Callback>();
let observer: IntersectionObserver | null = null;

const getObserver = (): IntersectionObserver | null => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return null;
    observer ??= new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                callbacks.get(entry.target)?.();
                callbacks.delete(entry.target);
                observer?.unobserve(entry.target);
            }
        },
        // Start a little before the element enters, so it is already moving when the eye gets there.
        {rootMargin: "0px 0px -8% 0px", threshold: 0.08},
    );
    return observer;
};

/**
 * Calls `onVisible` once, the first time `element` scrolls into view. One observer serves the whole site, so a page
 * with fifty revealing blocks costs the same as one. Without IntersectionObserver the callback runs at once.
 */
export const observeOnce = (element: Element, onVisible: Callback): (() => void) => {
    const shared = getObserver();
    if (!shared) {
        onVisible();
        return () => undefined;
    }
    callbacks.set(element, onVisible);
    shared.observe(element);
    return () => {
        callbacks.delete(element);
        shared.unobserve(element);
    };
};
