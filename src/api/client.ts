import {LOCAL_API_DELAY_MS} from "@/constants/other";

/** A failed request, in the same shape the Supabase-backed client will throw. */
export class ApiError extends Error {
    readonly status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

export const notFound = (what: string): never => {
    throw new ApiError(`${what} not found`, 404);
};

/**
 * Runs a read against the local data after a short delay, so pages meet real loading and error states.
 * Phase 2 swaps the bodies of the `*.api.ts` functions for Supabase queries; hooks and pages stay as they are.
 */
export const localRequest = <TData>(read: () => TData): Promise<TData> =>
    new Promise((resolve, reject) => {
        window.setTimeout(() => {
            try {
                resolve(read());
            } catch (error) {
                reject(error);
            }
        }, LOCAL_API_DELAY_MS);
    });
