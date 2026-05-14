import { env } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { encryptSecret } from "@/server/security/encryption";

export async function storeGoogleImportConnection(input: {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  scope: string;
}) {
  if (!env.GOOGLE_TOKEN_ENCRYPTION_SECRET) {
    throw new Error("GOOGLE_TOKEN_ENCRYPTION_SECRET is not configured.");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("A signed-in user is required to connect Google imports.");
  }

  const encryptedAccessToken = encryptSecret({
    plaintext: input.accessToken,
    secret: env.GOOGLE_TOKEN_ENCRYPTION_SECRET
  });
  const encryptedRefreshToken = input.refreshToken
    ? encryptSecret({
        plaintext: input.refreshToken,
        secret: env.GOOGLE_TOKEN_ENCRYPTION_SECRET
      })
    : null;

  const expiresAt = new Date(Date.now() + input.expiresIn * 1000).toISOString();
  const { error } = await supabase
    .from("google_import_connections")
    .upsert(
      {
        user_id: user.id,
        scope: input.scope,
        encrypted_access_token: encryptedAccessToken,
        encrypted_refresh_token: encryptedRefreshToken,
        expires_at: expiresAt,
        updated_at: new Date().toISOString()
      },
      { onConflict: "user_id" }
    );

  if (error) {
    throw new Error(`Failed to store Google import connection: ${error.message}`);
  }
}
