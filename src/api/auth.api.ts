import {AuthError} from "@supabase/supabase-js";
import {ApiError} from "@/api/client";
import {supabase} from "@/api/supabase";
import {ROUTES} from "@/constants/routes";

/** Auth errors carry a code (invalid_credentials, user_already_exists…) that the pages translate. */
const fail = (error: AuthError): never => {
    throw new ApiError(error.message, error.status ?? 400, error.code ?? "auth_error");
};

const absolute = (path: string) => `${window.location.origin}${path}`;

export const signIn = async ({email, password}: {email: string; password: string}) => {
    const {data, error} = await supabase.auth.signInWithPassword({email: email.trim(), password});
    if (error) fail(error);
    return data;
};

/** Returns `needsConfirmation: true` when the project asks new readers to confirm their email first. */
export const signUp = async ({fullName, email, password}: {fullName: string; email: string; password: string}) => {
    const {data, error} = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {data: {full_name: fullName.trim()}, emailRedirectTo: absolute(ROUTES.ACCOUNT)},
    });
    if (error) fail(error);
    // An already-registered email comes back without identities instead of an error, so nobody can probe addresses.
    if (data.user && data.user.identities?.length === 0) throw new ApiError("User already registered", 422, "user_already_exists");
    return {needsConfirmation: !data.session};
};

export const sendPasswordReset = async (email: string) => {
    const {error} = await supabase.auth.resetPasswordForEmail(email.trim(), {redirectTo: absolute(ROUTES.RESET_PASSWORD)});
    if (error) fail(error);
};

export const updatePassword = async (password: string) => {
    const {error} = await supabase.auth.updateUser({password});
    if (error) fail(error);
};

export const signOut = async () => {
    const {error} = await supabase.auth.signOut();
    if (error) fail(error);
};
