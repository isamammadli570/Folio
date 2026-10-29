const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent);

/** The modifier key as it is printed on the user's keyboard. */
export const MOD_KEY = isMac ? "⌘" : "Ctrl";
