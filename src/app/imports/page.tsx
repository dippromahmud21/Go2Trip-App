import { CalendarDays, FileUp, Mail, Sparkles } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";

const importTypes = [
  { icon: Mail, title: "Gmail", detail: "Read travel confirmations" },
  { icon: CalendarDays, title: "Google Calendar", detail: "Find trip events" },
  { icon: FileUp, title: "PDFs and screenshots", detail: "Upload bookings" },
  { icon: Sparkles, title: "AI review", detail: "Confirm before saving" }
];

export default function ImportsPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-5 py-8">
      <nav className="mb-8 flex items-center justify-between">
        <Link aria-label="Go2Trip home" href="/">
          <BrandLogo className="h-12" />
        </Link>
        <Link
          className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          href="/trips"
        >
          Trips
        </Link>
      </nav>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-ui-label text-[hsl(var(--brand-orange))]">
            Imports
          </p>
          <h1 className="text-title-md mt-2 text-[hsl(var(--brand-purple-deep))]">
            Bring plans into Go2Trip
          </h1>
        </div>
        <a
          className="inline-flex h-10 items-center justify-center rounded-md bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))]"
          href="/api/google/oauth/start"
        >
          Connect Google
        </a>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {importTypes.map((item) => (
          <div key={item.title} className="rounded-lg border bg-white p-4 shadow-sm">
            <item.icon className="h-5 w-5 text-[hsl(var(--primary))]" />
            <h2 className="mt-3 font-semibold">{item.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
