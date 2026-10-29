import {unwrap} from "@/api/client";
import {supabase} from "@/api/supabase";
import {ADDRESS_COLUMNS, type AddressRow, type ProfileRow} from "@/api/rows";
import type {Address, Profile} from "@/api/types";
import {mapAddressRow, mapProfileRow} from "@/helpers/rows";

export const getProfile = async (userId: string): Promise<Profile> => {
    const response = await supabase.from("profiles").select("id, full_name, phone").eq("id", userId).single<ProfileRow>();
    return mapProfileRow(unwrap(response));
};

export const updateProfile = async ({id, fullName, phone}: Profile): Promise<Profile> => {
    const response = await supabase
        .from("profiles")
        .upsert({id, full_name: fullName.trim(), phone: phone.trim() === "+994" ? "" : phone.trim(), updated_at: new Date().toISOString()})
        .select("id, full_name, phone")
        .single<ProfileRow>();
    return mapProfileRow(unwrap(response));
};

export type AddressInput = Omit<Address, "id">;

export const getAddresses = async (): Promise<Address[]> => {
    const response = await supabase.from("addresses").select(ADDRESS_COLUMNS).order("is_default", {ascending: false}).order("created_at").returns<AddressRow[]>();
    return unwrap(response).map(mapAddressRow);
};

/** Only one address is the default: marking one clears the flag on the others first. */
const clearDefault = async (userId: string) => {
    const {error} = await supabase.from("addresses").update({is_default: false}).eq("user_id", userId).eq("is_default", true);
    if (error) unwrap({data: null, error});
};

const toRow = (input: AddressInput) => ({
    label: input.label.trim(),
    city: input.city.trim(),
    line: input.line.trim(),
    note: input.note.trim(),
    is_default: input.isDefault,
});

export const saveAddress = async (userId: string, input: AddressInput, addressId?: string): Promise<Address> => {
    if (input.isDefault) await clearDefault(userId);
    const query = addressId
        ? supabase.from("addresses").update(toRow(input)).eq("id", addressId)
        : supabase.from("addresses").insert({...toRow(input), user_id: userId});
    const response = await query.select(ADDRESS_COLUMNS).single<AddressRow>();
    return mapAddressRow(unwrap(response));
};

export const deleteAddress = async (addressId: string) => {
    const {error} = await supabase.from("addresses").delete().eq("id", addressId);
    if (error) unwrap({data: null, error});
};
