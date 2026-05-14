import type { ParsedTravelDocument } from "@/features/imports/types";

export type TravelDocumentInput = {
  sourceText: string;
  sourceName?: string;
  mimeType?: string;
};

export type ExtractedFlight = ParsedTravelDocument["flights"][number];
export type ExtractedHotel = ParsedTravelDocument["hotels"][number];
export type ExtractedItineraryItem =
  ParsedTravelDocument["itineraryItems"][number];

export type NormalizedExpenseText = {
  title: string;
  amountMinor: number | null;
  currency: string | null;
  paidByName: string | null;
  participantNames: string[];
  confidence: number;
};

export type TravelAiProvider = {
  parseTravelDocument(input: TravelDocumentInput): Promise<ParsedTravelDocument>;
  extractFlight(input: TravelDocumentInput): Promise<ExtractedFlight[]>;
  extractHotel(input: TravelDocumentInput): Promise<ExtractedHotel[]>;
  extractItineraryItems(
    input: TravelDocumentInput
  ): Promise<ExtractedItineraryItem[]>;
  normalizeExpenseText(input: {
    sourceText: string;
  }): Promise<NormalizedExpenseText>;
};
