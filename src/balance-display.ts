import type { BalanceSnapshot } from './balance.js'
import Big from 'big.js'

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

/** Prefer familiar currency text; shorten only when it exceeds the 56px rail. */
export function formatBalanceAmount(amount: string, currency: string, locale: string): string {
  const exact = new Big(amount)
  const magnitude = Math.abs(Number(amount))
  const options = { style: 'currency', currency, currencyDisplay: 'narrowSymbol', useGrouping: false } as const
  // Treat wide localized units (万/亿) as two cells. Keep the rail's 12px type.
  const fits = (text: string): boolean => text.replace(/[^\u0000-\u00ff]/g, 'xx').length <= 8
  if (Number.isFinite(magnitude) && (magnitude > 0 || exact.eq(0))) {
    const tiny = magnitude > 0 && magnitude < 0.001
    const text = new Intl.NumberFormat(locale, {
      ...options,
      notation: magnitude >= 10_000 ? 'compact' : tiny ? 'scientific' : 'standard',
      minimumFractionDigits: tiny ? 0 : 2,
      maximumFractionDigits: tiny ? 1 : magnitude > 0 && magnitude < 0.01 ? 3 : 2,
    }).format(Number(amount))
    if (fits(text)) return text
    if (magnitude >= 1000) {
      const compact = new Intl.NumberFormat(locale, {
        ...options, notation: 'compact', minimumFractionDigits: 0, maximumFractionDigits: 1,
      }).format(Number(amount))
      if (fits(compact)) return compact
    }
  }
  // Decimal arithmetic also covers finite balances outside Number's range.
  const parts = new Intl.NumberFormat(locale, options).formatToParts(exact.lt(0) ? -1 : 0)
  const symbol = parts.find(({ type }) => type === 'currency')!.value
  const sign = exact.lt(0) ? parts.find(({ type }) => type === 'minusSign')!.value : ''
  const scientific = (places: number): string => {
    const [mantissa, exponent] = exact.abs().toExponential(places).split('e')
    const coefficient = new Intl.NumberFormat(locale, { maximumFractionDigits: 1, useGrouping: false }).format(Number(mantissa))
    return `${sign}${symbol}${coefficient}E${Number(exponent)}`
  }
  const precise = scientific(1)
  return fits(precise) ? precise : scientific(0)
}
