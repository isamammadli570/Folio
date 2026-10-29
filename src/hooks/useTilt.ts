import {useCallback, useRef, type PointerEvent} from "react";

/**
 * Tilts an element towards the pointer in 3D. The element reads `--rx`/`--ry` in its transform; the pointer handlers
 * go on the element or a parent. Touch input is ignored, so scrolling a list never wobbles the covers.
 */
export const useTilt = <TElement extends HTMLElement>(maxX = 12, maxY = 16) => {
    const ref = useRef<TElement>(null);

    const onPointerMove = useCallback((event: PointerEvent) => {
        const element = ref.current;
        if (!element || event.pointerType === "touch") return;
        const rect = element.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        element.style.setProperty("--ry", `${(x * maxY).toFixed(2)}deg`);
        element.style.setProperty("--rx", `${(-y * maxX).toFixed(2)}deg`);
    }, [maxX, maxY]);

    const onPointerLeave = useCallback(() => {
        ref.current?.style.setProperty("--ry", "0deg");
        ref.current?.style.setProperty("--rx", "0deg");
    }, []);

    return {ref, onPointerMove, onPointerLeave};
};
