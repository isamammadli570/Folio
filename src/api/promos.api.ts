import {unwrap} from "@/api/client";
import {supabase} from "@/api/supabase";

export type PromoCode = {
    code: string;
    percent: number;
    active: boolean;
    expiresAt: string | null;
    usageLimit: number | null;
    usedCount: number;
    createdAt: string;
};

export type PromoInput = Pick<PromoCode, "code" | "percent" | "expiresAt" | "usageLimit">;

type PromoRow = {code: string; percent: number; active: boolean; expires_at: string | null; usage_limit: number | null; used_count: number; created_at: string};

const COLUMNS = "code, percent, active, expires_at, usage_limit, used_count, created_at";

const fromRow = (row: PromoRow): PromoCode => ({
    code: row.code,
    percent: row.percent,
    active: row.active,
    expiresAt: row.expires_at,
    usageLimit: row.usage_limit,
    usedCount: row.used_count,
    createdAt: row.created_at,
});

/** All codes, newest first (admins only). */
export const getPromoCodes = async (): Promise<PromoCode[]> => {
    const response = await supabase.from("promo_codes").select(COLUMNS).order("created_at", {ascending: false}).returns<PromoRow[]>();
    return unwrap(response).map(fromRow);
};

/** A taken code comes back as DUPLICATE_ID, the same message the catalogue editor uses. */
export const createPromoCode = async (input: PromoInput) => {
    const {error} = await supabase.from("promo_codes").insert({
        code: input.code.trim().toUpperCase(),
        percent: input.percent,
        expires_at: input.expiresAt,
        usage_limit: input.usageLimit,
    });
    if (error?.code === "23505") throw new Error("DUPLICATE_ID");
    if (error) unwrap({data: null, error});
};

export const setPromoActive = async ({code, active}: {code: string; active: boolean}) => {
    const {error} = await supabase.from("promo_codes").update({active}).eq("code", code);
    if (error) unwrap({data: null, error});
};

export const deletePromoCode = async (code: string) => {
    const {error} = await supabase.from("promo_codes").delete().eq("code", code);
    if (error) unwrap({data: null, error});
};
