import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createGoogleImportAuthUrl } from "@/server/google/oauth";

export async function GET() {
  const state = randomUUID();
  const response = NextResponse.redirect(createGoogleImportAuthUrl({ state }));

  response.cookies.set("go2trip_google_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10
  });

  return response;
}
