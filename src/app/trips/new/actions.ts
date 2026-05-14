"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function createTrip(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const destination = String(formData.get("destination") ?? "").trim();
  const startsOn = String(formData.get("startsOn") ?? "").trim();
  const endsOn = String(formData.get("endsOn") ?? "").trim();
  const defaultCurrency = String(formData.get("defaultCurrency") ?? "USD").trim();

  if (!name) {
    redirect("/trips/new?error=name");
  }

  if (!destination) {
    redirect("/trips/new?error=destination");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?error=Please sign in before creating a trip");
  }

  const { data: trip, error: tripError } = await supabase
    .from("trips")
    .insert({
      owner_id: user.id,
      name,
      destination,
      starts_on: startsOn || null,
      ends_on: endsOn || null,
      default_currency: defaultCurrency
    })
    .select("id")
    .single();

  if (tripError || !trip) {
    if (
      tripError?.message.includes("Could not find the table 'public.trips'") ||
      tripError?.message.includes("relation \"public.trips\" does not exist")
    ) {
      redirect("/trips/new?error=schema");
    }

    redirect(
      `/trips/new?error=${encodeURIComponent(
        tripError?.message ?? "Unable to create trip"
      )}`
    );
  }

  const { error: participantError } = await supabase
    .from("trip_participants")
    .insert({
      trip_id: trip.id,
      user_id: user.id,
      display_name:
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "Trip owner",
      email: user.email ?? null,
      role: "owner",
      invitation_status: "accepted"
    });

  if (participantError) {
    if (
      participantError.message.includes(
        "Could not find the table 'public.trip_participants'"
      ) ||
      participantError.message.includes(
        "relation \"public.trip_participants\" does not exist"
      )
    ) {
      redirect("/trips/new?error=schema");
    }

    redirect(
      `/trips/new?error=${encodeURIComponent(
        participantError.message
      )}`
    );
  }

  redirect(`/trips?created=1&tripId=${trip.id}`);
}
