import { ArrowLeft, CalendarDays } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { BrandLogo } from "@/components/brand/brand-logo";
import { DestinationSearch } from "@/components/trips/destination-search";
import { Button } from "@/components/ui/button";
import { createTrip } from "@/app/trips/new/actions";

type NewTripPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function NewTripPage({ searchParams }: NewTripPageProps) {
  if (!isSupabaseConfigured()) {
    redirect("/sign-in");
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const params = await searchParams;
  const error = params?.error;

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-5 py-8">
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

      <section className="rounded-lg border bg-white p-5 shadow-sm sm:p-7">
        <p className="text-ui-label text-[hsl(var(--brand-orange))]">
          New trip
        </p>
        <h1 className="text-title-md mt-2 text-[hsl(var(--brand-purple-deep))]">
          Create your next plan
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Start with the basics. Flights, hotels, itinerary items, participants,
          and expenses can be added after the trip exists.
        </p>

        {error === "name" ? (
          <div className="mt-5 rounded-md border border-[hsl(var(--accent))] bg-[hsl(var(--brand-orange-soft))] px-4 py-3 text-sm text-[hsl(var(--foreground))]">
            Add a trip name so we know what to call this plan.
          </div>
        ) : null}

        {error === "destination" ? (
          <div className="mt-5 rounded-md border border-[hsl(var(--accent))] bg-[hsl(var(--brand-orange-soft))] px-4 py-3 text-sm text-[hsl(var(--foreground))]">
            Pick a destination before creating the trip.
          </div>
        ) : null}

        {error === "schema" ? (
          <div className="mt-5 rounded-md border border-[hsl(var(--destructive))] bg-white px-4 py-3 text-sm text-[hsl(var(--foreground))]">
            Supabase is connected, but the database tables are not created yet.
            Run the SQL from `supabase/migrations/0001_foundation.sql` in the
            Supabase SQL Editor, then try again.
          </div>
        ) : null}

        {error &&
        error !== "name" &&
        error !== "destination" &&
        error !== "schema" ? (
          <div className="mt-5 rounded-md border border-[hsl(var(--destructive))] bg-white px-4 py-3 text-sm text-[hsl(var(--destructive))]">
            {decodeURIComponent(error)}
          </div>
        ) : null}

        <form action={createTrip} className="mt-7 grid gap-5">
          <label className="grid gap-2 text-sm font-medium" htmlFor="trip-name">
            Trip name
            <input
              className="h-11 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))]"
              id="trip-name"
              name="name"
              placeholder="March escape"
              required
              type="text"
            />
          </label>

          <label
            className="grid gap-2 text-sm font-medium"
            htmlFor="destination"
          >
            Destination
            <DestinationSearch name="destination" />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label
              className="grid gap-2 text-sm font-medium"
              htmlFor="starts-on"
            >
              Start date
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  className="h-11 w-full rounded-md border bg-background pl-10 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))]"
                  id="starts-on"
                  name="startsOn"
                  type="date"
                />
              </div>
            </label>

            <label className="grid gap-2 text-sm font-medium" htmlFor="ends-on">
              End date
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  className="h-11 w-full rounded-md border bg-background pl-10 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))]"
                  id="ends-on"
                  name="endsOn"
                  type="date"
                />
              </div>
            </label>
          </div>

          <label
            className="grid gap-2 text-sm font-medium"
            htmlFor="default-currency"
          >
            Default currency
            <select
              className="h-11 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))]"
              defaultValue="USD"
              id="default-currency"
              name="defaultCurrency"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="BDT">BDT</option>
              <option value="JPY">JPY</option>
              <option value="SGD">SGD</option>
            </select>
          </label>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button asChild variant="ghost">
              <Link href="/trips">Cancel</Link>
            </Button>
            <Button type="submit">Create trip</Button>
          </div>
        </form>
      </section>
    </main>
  );
}
