import type { ExpenseParticipantShare } from "@/features/expenses/types";

export function splitEqual(input: {
  amountMinor: number;
  participantIds: string[];
}): ExpenseParticipantShare[] {
  if (input.participantIds.length === 0) {
    throw new Error("At least one participant is required.");
  }

  const baseShare = Math.floor(input.amountMinor / input.participantIds.length);
  const remainder = input.amountMinor % input.participantIds.length;

  return input.participantIds.map((participantId, index) => ({
    participantId,
    amountMinor: baseShare + (index < remainder ? 1 : 0)
  }));
}

export function validateCustomShares(input: {
  amountMinor: number;
  shares: ExpenseParticipantShare[];
}) {
  const total = input.shares.reduce((sum, share) => sum + share.amountMinor, 0);

  if (total !== input.amountMinor) {
    throw new Error("Custom shares must add up to the expense total.");
  }

  if (new Set(input.shares.map((share) => share.participantId)).size !== input.shares.length) {
    throw new Error("Custom shares cannot contain duplicate participants.");
  }

  return input.shares;
}
