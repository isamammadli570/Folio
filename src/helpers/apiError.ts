import {ApiError} from "@/api/client";

/** The short code of a failed request (invalid_credentials, OUT_OF_STOCK…), or "" when there is none. */
export const errorCode = (error: unknown): string => (error instanceof ApiError ? error.code : "");

/** "OUT_OF_STOCK:republic" → ["OUT_OF_STOCK", "republic"]. */
export const splitErrorCode = (error: unknown): [string, string] => {
    const message = error instanceof Error ? error.message : "";
    const [code = "", detail = ""] = message.split(":").map((part) => part.trim());
    return [code, detail];
};
