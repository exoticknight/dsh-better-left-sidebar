import type { BalanceSnapshot } from './balance.js'

export type BalanceCurrency = 'CNY' | 'USD'
export const BALANCE_CURRENCIES = ['CNY', 'USD'] as const

export function normalizeBalanceCurrency(value: unknown): BalanceCurrency {
  return value === 'USD' ? 'USD' : 'CNY'
}

/** Never substitute another currency or invent a zero for a missing wallet. */
export function selectBalanceCurrency(balance: BalanceSnapshot | null, currency: BalanceCurrency): BalanceSnapshot | null {
  const amount = balance?.amounts.find((item) => item.currency === currency)
  return balance && amount ? { source: balance.source, amounts: [amount] } : null
}
