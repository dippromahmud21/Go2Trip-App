import type { CurrencyCode, ExchangeRateSnapshot } from "@/features/currencies/money";

export type ExchangeRateProvider = {
  getRate(input: {
    baseCurrency: CurrencyCode;
    quoteCurrency: CurrencyCode;
    at?: Date;
  }): Promise<ExchangeRateSnapshot>;
};

export class MissingExchangeRateProvider implements ExchangeRateProvider {
  async getRate(): Promise<ExchangeRateSnapshot> {
    throw new Error("No exchange rate provider configured.");
  }
}
