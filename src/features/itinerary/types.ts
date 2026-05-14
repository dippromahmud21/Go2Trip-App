export type ItineraryItemKind =
  | "flight"
  | "hotel"
  | "activity"
  | "meal"
  | "transport"
  | "note";

export type ItineraryItem = {
  id: string;
  tripId: string;
  kind: ItineraryItemKind;
  title: string;
  startsAt: string | null;
  endsAt: string | null;
  locationName: string | null;
  notes: string | null;
  sourceImportId: string | null;
};
