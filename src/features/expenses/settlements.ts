import type { Expense, SettlementTransfer } from "@/features/expenses/types";

type Balance = {
  participantId: string;
  amountMinor: number;
};

export function calculateBalances(expenses: Expense[]): Balance[] {
  const balances = new Map<string, number>();

  for (const expense of expenses) {
    const paid = balances.get(expense.paidByParticipantId) ?? 0;
    balances.set(
      expense.paidByParticipantId,
      paid + expense.tripAmount.amountMinor
    );

    for (const share of expense.shares) {
      const current = balances.get(share.participantId) ?? 0;
      balances.set(share.participantId, current - share.amountMinor);
    }
  }

  return [...balances.entries()]
    .map(([participantId, amountMinor]) => ({ participantId, amountMinor }))
    .sort((a, b) => a.participantId.localeCompare(b.participantId));
}

export function minimizeSettlementTransfers(input: {
  expenses: Expense[];
  currency: string;
}): SettlementTransfer[] {
  const balances = calculateBalances(input.expenses);
  const debtors = balances
    .filter((balance) => balance.amountMinor < 0)
    .map((balance) => ({ ...balance, amountMinor: -balance.amountMinor }))
    .sort(sortBalance);
  const creditors = balances
    .filter((balance) => balance.amountMinor > 0)
    .sort(sortBalance);

  const transfers: SettlementTransfer[] = [];
  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];
    const amountMinor = Math.min(debtor.amountMinor, creditor.amountMinor);

    if (amountMinor > 0) {
      transfers.push({
        fromParticipantId: debtor.participantId,
        toParticipantId: creditor.participantId,
        amountMinor,
        currency: input.currency
      });
    }

    debtor.amountMinor -= amountMinor;
    creditor.amountMinor -= amountMinor;

    if (debtor.amountMinor === 0) debtorIndex += 1;
    if (creditor.amountMinor === 0) creditorIndex += 1;
  }

  return transfers;
}

function sortBalance(a: Balance, b: Balance) {
  if (b.amountMinor !== a.amountMinor) {
    return b.amountMinor - a.amountMinor;
  }

  return a.participantId.localeCompare(b.participantId);
}
