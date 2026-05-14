import { describe, expect, it } from "vitest";
import { convertMoney } from "@/features/currencies/money";

describe("convertMoney", () => {
  it("converts using a historical rate snapshot", () => {
    expect(
      convertMoney(
        { amountMinor: 1000, currency: "USD" },
        "EUR",
        {
          baseCurrency: "USD",
          quoteCurrency: "EUR",
          rate: 0.92,
          capturedAt: "2026-03-01T00:00:00.000Z",
          provider: "fixture"
        }
      )
    ).toEqual({ amountMinor: 920, currency: "EUR" });
  });
});
