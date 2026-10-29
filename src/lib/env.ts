const readEnv = (value: string | undefined): string => value?.trim() ?? "";

export const ENV = {
    supabaseUrl: readEnv(import.meta.env.VITE_SUPABASE_URL).replace(/\/+$/, "").replace(/\/rest\/v1$/, ""),
    supabaseAnonKey: readEnv(import.meta.env.VITE_SUPABASE_ANON_KEY),
} as const;

if ((!ENV.supabaseUrl || !ENV.supabaseAnonKey) && import.meta.env.DEV) {
    console.warn("VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not set. Copy .env.example to .env.local.");
}
