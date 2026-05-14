import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .transform((value) => (value === "" ? undefined : value))
  .pipe(z.string().url().optional());

const optionalString = z
  .string()
  .trim()
  .transform((value) => (value === "" ? undefined : value))
  .optional();

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: optionalUrl,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalString,
  SUPABASE_SERVICE_ROLE_KEY: optionalString,
  DEEPSEEK_API_KEY: optionalString,
  DEEPSEEK_API_BASE_URL: z.string().url().default("https://api.deepseek.com"),
  DEEPSEEK_DEFAULT_MODEL: z.string().default("deepseek-v4-flash"),
  DEEPSEEK_REASONING_MODEL: z.string().default("deepseek-v4-pro"),
  GOOGLE_CLIENT_ID: optionalString,
  GOOGLE_CLIENT_SECRET: optionalString,
  GOOGLE_OAUTH_REDIRECT_URI: optionalUrl,
  GOOGLE_TOKEN_ENCRYPTION_SECRET: optionalString,
  FX_PROVIDER_BASE_URL: optionalUrl,
  FX_PROVIDER_API_KEY: optionalString
});

export const env = envSchema.parse(process.env);
