import {
  parsedTravelDocumentSchema,
  type ParsedTravelDocument
} from "@/features/imports/types";
import { env } from "@/lib/env";
import type {
  NormalizedExpenseText,
  TravelAiProvider,
  TravelDocumentInput
} from "@/server/ai/types";

type DeepSeekChatResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

export class DeepSeekTravelAiProvider implements TravelAiProvider {
  async parseTravelDocument(
    input: TravelDocumentInput
  ): Promise<ParsedTravelDocument> {
    const content = await completeJson({
      model: env.DEEPSEEK_DEFAULT_MODEL,
      system:
        "Extract structured travel data. Return JSON only. Missing fields should be omitted.",
      user: `Source name: ${input.sourceName ?? "unknown"}\nMIME: ${input.mimeType ?? "text/plain"}\n\n${input.sourceText}`
    });

    return parsedTravelDocumentSchema.parse(JSON.parse(content));
  }

  async extractFlight(input: TravelDocumentInput) {
    return (await this.parseTravelDocument(input)).flights;
  }

  async extractHotel(input: TravelDocumentInput) {
    return (await this.parseTravelDocument(input)).hotels;
  }

  async extractItineraryItems(input: TravelDocumentInput) {
    return (await this.parseTravelDocument(input)).itineraryItems;
  }

  async normalizeExpenseText(input: {
    sourceText: string;
  }): Promise<NormalizedExpenseText> {
    const content = await completeJson({
      model: env.DEEPSEEK_REASONING_MODEL,
      system:
        "Normalize an expense note. Return JSON with title, amountMinor, currency, paidByName, participantNames, confidence.",
      user: input.sourceText
    });

    return JSON.parse(content) as NormalizedExpenseText;
  }
}

async function completeJson(input: {
  model: string;
  system: string;
  user: string;
}) {
  if (!env.DEEPSEEK_API_KEY) {
    throw new Error("DEEPSEEK_API_KEY is not configured.");
  }

  const response = await fetch(`${env.DEEPSEEK_API_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: input.model,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: input.system },
        { role: "user", content: input.user }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`DeepSeek request failed with ${response.status}.`);
  }

  const data = (await response.json()) as DeepSeekChatResponse;
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("DeepSeek response did not include message content.");
  }

  return content;
}
