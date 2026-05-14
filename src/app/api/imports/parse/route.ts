import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createTravelAiProvider } from "@/server/ai";

const parseRequestSchema = z.object({
  sourceText: z.string().min(1),
  sourceName: z.string().optional(),
  mimeType: z.string().optional()
});

export async function POST(request: NextRequest) {
  const body = parseRequestSchema.parse(await request.json());
  const provider = createTravelAiProvider();
  const parsed = await provider.parseTravelDocument(body);

  return NextResponse.json({ parsed });
}
