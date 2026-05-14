import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type TripListItem = {
  id: string;
  name: string;
  destination: string;
  startsOn: string | null;
  endsOn: string | null;
  defaultCurrency: string;
  participantCount: number;
};

export class TripsSchemaNotReadyError extends Error {
  constructor(message = "Trips schema is not ready in Supabase.") {
    super(message);
    this.name = "TripsSchemaNotReadyError";
  }
}

export const getUserTrips = cache(async () => {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("trips")
    .select(
      `
        id,
        name,
        destination,
        starts_on,
        ends_on,
        default_currency,
        trip_participants(count)
      `
    )
    .order("created_at", { ascending: false });

  if (error) {
    if (
      error.message.includes("Could not find the table 'public.trips'") ||
      error.message.includes("relation \"public.trips\" does not exist")
    ) {
      throw new TripsSchemaNotReadyError();
    }

    throw new Error(`Failed to load trips: ${error.message}`);
  }

  return (data ?? []).map((trip) => ({
    id: trip.id,
    name: trip.name,
    destination: trip.destination,
    startsOn: trip.starts_on,
    endsOn: trip.ends_on,
    defaultCurrency: trip.default_currency,
    participantCount: trip.trip_participants?.[0]?.count ?? 0
  })) satisfies TripListItem[];
});
