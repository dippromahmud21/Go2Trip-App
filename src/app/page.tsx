import { CalendarDays, Plane, ReceiptText, UsersRound } from "lucide-react";
import Link from "next/link";
import { SessionButton } from "@/components/auth/session-button";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";

const pillars = [
  {
    icon: Plane,
    label: "Trips",
    value: "Flights, stays, plans"
  },
  {
    icon: UsersRound,
    label: "People",
    value: "Live collaboration"
  },
  {
    icon: ReceiptText,
    label: "Expenses",
    value: "Fair settlements"
  },
  {
    icon: CalendarDays,
    label: "Imports",
    value: "Gmail, Calendar, PDFs"
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <nav className="flex items-center justify-between">
          <Link aria-label="Go2Trip home" href="/">
            <BrandLogo className="h-12 sm:h-14" priority />
          </Link>
          <SessionButton />
        </nav>

        <div className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-xl">
            <p className="text-ui-label mb-3 text-[hsl(var(--brand-orange))]">
              Collaborative travel planning
            </p>
            <h1 className="text-title-xl text-[hsl(var(--brand-purple-deep))]">
              Go2Trip
            </h1>
            <p className="text-body-lg mt-5 text-muted-foreground">
              Plan trips with friends, import bookings from Google and files,
              and settle shared expenses without losing the thread.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/trips">Create a trip</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/imports">Preview shared trip</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-lg border bg-[hsl(var(--surface))] p-4 shadow-sm">
            <div className="rounded-md bg-[hsl(var(--brand-orange-soft))] p-4">
              <div className="rounded-md bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Bangkok</p>
                    <h2 className="font-display text-3xl text-[hsl(var(--brand-purple-deep))]">
                      March escape
                    </h2>
                  </div>
                  <span className="rounded-full bg-[hsl(var(--accent))] px-3 py-1 text-sm font-semibold text-accent-foreground">
                    5 people
                  </span>
                </div>
                <div className="mt-5 space-y-3">
                  {pillars.map((pillar) => (
                    <div
                      key={pillar.label}
                      className="flex items-center gap-3 rounded-md border bg-background p-3"
                    >
                      <pillar.icon className="h-5 w-5 text-[hsl(var(--primary))]" />
                      <div>
                        <p className="text-sm font-medium">{pillar.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {pillar.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
