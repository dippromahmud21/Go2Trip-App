import { ArrowLeft, CalendarDays, Coins, MapPin, UsersRound } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";

type TripPageProps = {
  params: Promise<{
    tripId: string;
  }>;
};

export default async function TripPage({ params }: TripPageProps) {
  if (!isSupabaseConfigured()) {
    redirect("/trips");
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { tripId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: trip, error } = await supabase
    .from("trips")
    .select(
      `
        id,
        name,
        destination,
        starts_on,
        ends_on,
        default_currency,
        trip_participants (
          id,
          display_name,
          role
        )
      `
    )
    .eq("id", tripId)
    .single();

  if (error || !trip) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-5 py-8">
      <nav className="mb-8 flex items-center justify-between">
        <Link aria-label="Go2Trip home" href="/">
          <BrandLogo className="h-12" />
        </Link>
        <Button asChild variant="ghost">
          <Link href="/trips">
            <ArrowLeft className="h-4 w-4" />
            Trips
          </Link>
        </Button>
      </nav>

      <section className="rounded-lg border bg-white p-6 shadow-sm">
        <p className="text-ui-label text-[hsl(var(--brand-orange))]">
          {trip.destination || "Trip"}
        </p>
        <h1 className="text-title-md mt-2 text-[hsl(var(--brand-purple-deep))]">
          {trip.name}
        </h1>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <DetailTile
            icon={<MapPin className="h-4 w-4" />}
            label="Destination"
            value={trip.destination || "Not set"}
          />
          <DetailTile
            icon={<CalendarDays className="h-4 w-4" />}
            label="Dates"
            value={formatTripDateRange(trip.starts_on, trip.ends_on)}
          />
          <DetailTile
            icon={<Coins className="h-4 w-4" />}
            label="Currency"
            value={trip.default_currency}
          />
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-lg border bg-background p-5">
            <h2 className="font-display text-2xl text-[hsl(var(--brand-purple-deep))]">
              Plan overview
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              This trip is now stored in the database. Flights, hotels,
              itinerary items, and expenses can be attached to this record in
              the next implementation pass.
            </p>
          </section>

          <section className="rounded-lg border bg-background p-5">
            <div className="flex items-center gap-2">
              <UsersRound className="h-4 w-4 text-[hsl(var(--brand-orange))]" />
              <h2 className="font-display text-2xl text-[hsl(var(--brand-purple-deep))]">
                Participants
              </h2>
            </div>
            <div className="mt-4 grid gap-3">
              {trip.trip_participants?.map((participant) => (
                <div
                  className="rounded-md border bg-white px-4 py-3 text-sm"
                  key={participant.id}
                >
                  <p className="font-semibold text-[hsl(var(--brand-purple-deep))]">
                    {participant.display_name}
                  </p>
                  <p className="mt-1 text-muted-foreground capitalize">
                    {participant.role}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function DetailTile(input: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        {input.icon}
        {input.label}
      </div>
      <p className="mt-3 text-base font-semibold text-[hsl(var(--brand-purple-deep))]">
        {input.value}
      </p>
    </div>
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
