import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";
import {
  getUserTrips,
  TripsSchemaNotReadyError
} from "@/features/trips/data";

type TripsPageProps = {
  searchParams?: Promise<{
    created?: string;
    tripId?: string;
  }>;
};

export default async function TripsPage({ searchParams }: TripsPageProps) {
  if (!isSupabaseConfigured()) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-5xl px-5 py-8">
        <nav className="mb-8 flex items-center justify-between">
          <Link aria-label="Go2Trip home" href="/">
            <BrandLogo className="h-12" />
          </Link>
          <Button asChild variant="ghost">
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </nav>
        <div className="rounded-lg border bg-white p-6 text-sm leading-6 text-muted-foreground shadow-sm">
          Connect Supabase in your environment to enable real trips, shared data,
          and authentication.
        </div>
      </main>
    );
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const params = await searchParams;
  let trips = [];

  try {
    trips = await getUserTrips();
  } catch (error) {
    if (error instanceof TripsSchemaNotReadyError) {
      return (
        <main className="mx-auto min-h-screen w-full max-w-5xl px-5 py-8">
          <nav className="mb-8 flex items-center justify-between">
            <Link aria-label="Go2Trip home" href="/">
              <BrandLogo className="h-12" />
            </Link>
            <Button asChild variant="ghost">
              <Link href="/imports">Imports</Link>
            </Button>
          </nav>
          <div className="rounded-lg border bg-white p-6 text-sm leading-6 text-muted-foreground shadow-sm">
            Supabase authentication is working, but the app tables are not in
            your database yet. Run the SQL from
            `supabase/migrations/0001_foundation.sql` in the Supabase SQL
            Editor, then refresh this page.
          </div>
        </main>
      );
    }

    throw error;
  }

  const createdTripId = params?.created === "1" ? params.tripId?.trim() : "";
  const createdTrip = createdTripId
    ? trips.find((trip) => trip.id === createdTripId)
    : null;

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-5 py-8">
      <nav className="mb-8 flex items-center justify-between">
        <Link aria-label="Go2Trip home" href="/">
          <BrandLogo className="h-12" />
        </Link>
        <Button asChild variant="ghost">
          <Link href="/imports">Imports</Link>
        </Button>
      </nav>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-ui-label text-[hsl(var(--brand-orange))]">Trips</p>
          <h1 className="text-title-md mt-2 text-[hsl(var(--brand-purple-deep))]">
            Your trips
          </h1>
        </div>
        <Button asChild>
          <Link href="/trips/new">
            <Plus className="h-4 w-4" />
            New trip
          </Link>
        </Button>
      </div>

      {createdTrip ? (
        <div className="mt-6 rounded-lg border bg-[hsl(var(--brand-orange-soft))] px-5 py-4 text-sm text-[hsl(var(--foreground))] shadow-sm">
          <span className="font-semibold">{createdTrip.name}</span>
          {createdTrip.destination ? ` for ${createdTrip.destination}` : ""} is
          ready for flights, stays, itinerary items, and shared expenses.
        </div>
      ) : null}

      {trips.length === 0 ? (
        <div className="mt-8 rounded-lg border bg-white p-6 text-sm leading-6 text-muted-foreground shadow-sm">
          You do not have any trips yet. Create one to start organizing flights,
          hotels, itinerary items, participants, and expenses.
        </div>
      ) : (
        <div className="mt-8 grid gap-4">
          {trips.map((trip) => (
            <article
              className="rounded-lg border bg-white p-5 shadow-sm"
              key={trip.id}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-ui-label text-[hsl(var(--brand-orange))]">
                    {trip.destination}
                  </p>
                  <h2 className="font-display mt-2 text-3xl text-[hsl(var(--brand-purple-deep))]">
                    {trip.name}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {formatTripDateRange(trip.startsOn, trip.endsOn)} •{" "}
                    {trip.participantCount} participant
                    {trip.participantCount === 1 ? "" : "s"} •{" "}
                    {trip.defaultCurrency}
                  </p>
                </div>
                <Button asChild variant="secondary">
                  <Link href={`/trips/${trip.id}`}>Open trip</Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

function formatTripDateRange(startsOn: string | null, endsOn: string | null) {
  if (!startsOn && !endsOn) {
    return "Dates not set";
  }

  if (startsOn && endsOn) {
    return `${startsOn} to ${endsOn}`;
  }

  return startsOn || endsOn || "Dates not set";
}
