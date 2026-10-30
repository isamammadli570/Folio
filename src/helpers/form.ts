/** Form inputs hold numbers as text; a comma works as the decimal point. Empty or invalid text becomes NaN. */
export const toNumber = (value: string): number => (value.trim() === "" ? Number.NaN : Number(value.replace(",", ".").trim()));

/** An optional number field: empty text means "not set". */
export const toOptionalNumber = (value: string): number | undefined => (value.trim() === "" ? undefined : toNumber(value));

/** The text a form shows for an optional number. */
export const fromOptionalNumber = (value: number | undefined): string => (value === undefined ? "" : String(value));
