import { describe, expect, it } from "vitest";
import { splitEqual, validateCustomShares } from "@/features/expenses/splitting";
import { minimizeSettlementTransfers } from "@/features/expenses/settlements";
import type { Expense } from "@/features/expenses/types";

describe("expense splitting", () => {
  it("splits equal expenses deterministically", () => {
    expect(
      splitEqual({ amountMinor: 100, participantIds: ["a", "b", "c"] })
    ).toEqual([
      { participantId: "a", amountMinor: 34 },
      { participantId: "b", amountMinor: 33 },
      { participantId: "c", amountMinor: 33 }
    ]);
  });

  it("rejects custom shares that do not match the total", () => {
    expect(() =>
      validateCustomShares({
        amountMinor: 100,
        shares: [{ participantId: "a", amountMinor: 99 }]
      })
    ).toThrow("Custom shares must add up");
  });
});

describe("settlements", () => {
  it("minimizes transfers from balances", () => {
    const expenses: Expense[] = [
      {
        id: "expense-1",
        tripId: "trip-1",
        title: "Dinner",
        paidByParticipantId: "a",
        amount: { amountMinor: 9000, currency: "USD" },
        tripAmount: { amountMinor: 9000, currency: "USD" },
        exchangeRateSnapshotId: null,
        splitType: "equal",
        shares: [
          { participantId: "a", amountMinor: 3000 },
          { participantId: "b", amountMinor: 3000 },
          { participantId: "c", amountMinor: 3000 }
        ],
        incurredAt: "2026-03-01T00:00:00.000Z"
      }
    ];

    expect(minimizeSettlementTransfers({ expenses, currency: "USD" })).toEqual([
      {
        fromParticipantId: "b",
        toParticipantId: "a",
        amountMinor: 3000,
        currency: "USD"
      },
      {
        fromParticipantId: "c",
        toParticipantId: "a",
        amountMinor: 3000,
        currency: "USD"
      }
    ]);
  });
});
