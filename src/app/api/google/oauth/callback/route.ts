import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { exchangeGoogleCodeForTokens } from "@/server/google/oauth";
import { storeGoogleImportConnection } from "@/server/google/connections";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const expectedState = request.cookies.get("go2trip_google_oauth_state")?.value;

  if (!code || !state || state !== expectedState) {
    return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}/imports?error=oauth_state`);
  }

  const tokens = await exchangeGoogleCodeForTokens(code);
  await storeGoogleImportConnection({
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresIn: tokens.expires_in,
    scope: tokens.scope,
  });

  const response = NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}/imports?connected=google`);
  response.cookies.delete("go2trip_google_oauth_state");
  return response;
}
