import type { Money } from "@/features/currencies/money";

export type ExpenseSplitType = "equal" | "custom_amounts";

export type ExpenseParticipantShare = {
  participantId: string;
  amountMinor: number;
};

export type Expense = {
  id: string;
  tripId: string;
  title: string;
  paidByParticipantId: string;
  amount: Money;
  tripAmount: Money;
  exchangeRateSnapshotId: string | null;
  splitType: ExpenseSplitType;
  shares: ExpenseParticipantShare[];
  incurredAt: string;
};

export type SettlementTransfer = {
  fromParticipantId: string;
  toParticipantId: string;
  amountMinor: number;
  currency: string;
};
