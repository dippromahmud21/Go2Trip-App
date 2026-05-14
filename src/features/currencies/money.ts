export type CurrencyCode = string;

export type Money = {
  amountMinor: number;
  currency: CurrencyCode;
};

export type ExchangeRateSnapshot = {
  baseCurrency: CurrencyCode;
  quoteCurrency: CurrencyCode;
  rate: number;
  capturedAt: string;
  provider: string;
};

export function convertMoney(
  money: Money,
  targetCurrency: CurrencyCode,
  rate: ExchangeRateSnapshot
): Money {
  if (money.currency === targetCurrency) {
    return money;
  }

  if (
    rate.baseCurrency !== money.currency ||
    rate.quoteCurrency !== targetCurrency
  ) {
    throw new Error("Exchange rate does not match conversion request.");
  }

  return {
    amountMinor: Math.round(money.amountMinor * rate.rate),
    currency: targetCurrency
  };
}
