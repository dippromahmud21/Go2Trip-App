import { env } from "@/lib/env";

export function isSupabaseConfigured() {
  return Boolean(
    env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function getSupabaseConfig() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase public environment variables are not configured.");
  }

  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL as string,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  };
}
