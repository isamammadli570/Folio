import {useEffect, useState} from "react";

/** `value`, but only after it has stopped changing for `delay` ms. */
export const useDebouncedValue = <TValue>(value: TValue, delay = 250): TValue => {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = window.setTimeout(() => setDebounced(value), delay);
        return () => window.clearTimeout(timer);
    }, [value, delay]);

    return debounced;
};
