import { z } from "zod";

export type ImportSource =
  | "gmail"
  | "google_calendar"
  | "pdf"
  | "screenshot"
  | "pasted_text";

export type ImportStatus = "queued" | "parsed" | "needs_review" | "accepted" | "failed";

export const parsedTravelDocumentSchema = z.object({
  confidence: z.number().min(0).max(1),
  flights: z.array(
    z.object({
      airline: z.string().optional(),
      flightNumber: z.string().optional(),
      departureAirport: z.string().optional(),
      arrivalAirport: z.string().optional(),
      departsAt: z.string().optional(),
      arrivesAt: z.string().optional(),
      confirmationCode: z.string().optional()
    })
  ),
  hotels: z.array(
    z.object({
      name: z.string().optional(),
      address: z.string().optional(),
      checkIn: z.string().optional(),
      checkOut: z.string().optional(),
      confirmationCode: z.string().optional()
    })
  ),
  itineraryItems: z.array(
    z.object({
      title: z.string(),
      startsAt: z.string().optional(),
      endsAt: z.string().optional(),
      locationName: z.string().optional(),
      notes: z.string().optional()
    })
  )
});

export type ParsedTravelDocument = z.infer<typeof parsedTravelDocumentSchema>;
