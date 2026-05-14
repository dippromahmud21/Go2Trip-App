"use client";

import { useDeferredValue, useEffect, useRef, useState } from "react";
import { MapPin, Search } from "lucide-react";
import {
  destinationOptions,
  formatDestination,
  type DestinationOption
} from "@/features/trips/destination-options";

type DestinationSearchProps = {
  defaultValue?: string;
  name: string;
};

export function DestinationSearch({
  defaultValue = "",
  name
}: DestinationSearchProps) {
  const [query, setQuery] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const deferredQuery = useDeferredValue(query);
  const rootRef = useRef<HTMLDivElement>(null);

  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const results =
    normalizedQuery.length === 0
      ? destinationOptions.slice(0, 6)
      : destinationOptions
          .filter((option) => matchesDestination(option, normalizedQuery))
          .slice(0, 6);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <div className="relative" ref={rootRef}>
      <MapPin className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
      <input
        autoComplete="off"
        className="h-11 w-full rounded-md border bg-background pl-10 pr-10 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))]"
        id="destination"
        name={name}
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="Search city or country"
        type="text"
        value={query}
      />
      <Search className="pointer-events-none absolute right-3 top-3 h-5 w-5 text-muted-foreground" />

      {isOpen ? (
        <div className="absolute z-20 mt-2 w-full rounded-md border bg-white p-2 shadow-lg">
          <p className="px-2 pb-2 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Suggested destinations
          </p>

          {results.length > 0 ? (
            <div className="grid gap-1">
              {results.map((option) => (
                <button
                  className="flex w-full items-start justify-between rounded-md px-3 py-2 text-left transition-colors hover:bg-[hsl(var(--brand-orange-soft))]"
                  key={option.id}
                  onClick={() => {
                    setQuery(formatDestination(option));
                    setIsOpen(false);
                  }}
                  type="button"
                >
                  <span>
                    <span className="block text-sm font-semibold text-[hsl(var(--brand-purple-deep))]">
                      {option.city}
                    </span>
                    <span className="block text-sm text-muted-foreground">
                      {option.country}
                    </span>
                  </span>
                  {option.airportCode ? (
                    <span className="rounded-full bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground">
                      {option.airportCode}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-md bg-[hsl(var(--brand-orange-soft))] px-3 py-3 text-sm text-muted-foreground">
              No destinations match that search yet.
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function matchesDestination(option: DestinationOption, query: string) {
  return [option.city, option.country, option.region, option.airportCode]
    .filter(Boolean)
    .some((value) => value!.toLowerCase().includes(query));
}
