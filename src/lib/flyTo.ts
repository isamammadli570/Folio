/** The element a flying book lands on; the header cart button carries this attribute. */
export const CART_TARGET_ATTRIBUTE = "data-cart-target";

const prefersReducedMotion = (): boolean => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Throws a copy of `source` in an arc to the visible cart button, then calls `onLand`. Without a visible target, or
 * with reduced motion, `onLand` runs straight away.
 */
export const flyToCart = (source: HTMLElement, onLand: () => void): void => {
    const target = [...document.querySelectorAll<HTMLElement>(`[${CART_TARGET_ATTRIBUTE}]`)].find((element) => element.offsetParent !== null);
    if (!target || prefersReducedMotion()) {
        onLand();
        return;
    }

    const from = source.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    const width = 60;
    const height = width * 1.5;
    const flyer = source.cloneNode(true) as HTMLElement;
    Object.assign(flyer.style, {position: "fixed", left: "0", top: "0", width: `${width}px`, margin: "0", zIndex: "100", pointerEvents: "none"});
    document.body.appendChild(flyer);

    const startX = from.left + from.width / 2 - width / 2;
    const startY = from.top + from.height / 2 - height / 2;
    const endX = to.left + to.width / 2 - width / 2;
    const endY = to.top + to.height / 2 - height / 2;
    const startScale = Math.min(2.4, from.width / width);

    const animation = flyer.animate(
        [
            {transform: `translate(${startX}px, ${startY}px) scale(${startScale})`},
            {transform: `translate(${(startX + endX) / 2}px, ${Math.min(startY, endY) - 120}px) scale(1) rotate(-12deg)`, offset: 0.55},
            {transform: `translate(${endX}px, ${endY}px) scale(0.2) rotate(8deg)`, opacity: 0.2},
        ],
        {duration: 850, easing: "cubic-bezier(.5,0,.3,1)"},
    );
    animation.onfinish = () => {
        flyer.remove();
        onLand();
    };
};
