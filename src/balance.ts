import Big from 'big.js'

export interface BalanceAmount {
  currency: 'CNY' | 'USD'
  amount: string
}

export interface BalanceSnapshot {
  source: 'account' | 'api-key'
  amounts: BalanceAmount[]
}

function record(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown> : undefined
}

function amount(currency: unknown, value: unknown): BalanceAmount | null {
  if ((currency !== 'CNY' && currency !== 'USD') || typeof value !== 'string'
    || !/^-?\d+(?:\.\d+)?$/.test(value)) return null
  return { currency, amount: new Big(value).toFixed() }
}

/** Sum recharge and bonus wallets by currency without losing decimal precision. */
export function accountBalance(value: unknown): BalanceSnapshot | null {
  const result = record(value)
  if (result?.status !== 'ready' || !Array.isArray(result.value) || !Array.isArray(result.bonusWallets)) return null
  const totals = new Map<BalanceAmount['currency'], Big>()
  for (const wallet of [...result.value, ...result.bonusWallets]) {
    const row = record(wallet)
    const parsed = amount(row?.currency, row?.balance)
    if (!parsed) return null
    totals.set(parsed.currency, (totals.get(parsed.currency) ?? new Big(0)).plus(parsed.amount))
  }
  return totals.size ? {
    source: 'account',
    amounts: [...totals].map(([currency, total]) => ({ currency, amount: total.toFixed() })),
  } : null
}

export function apiKeyBalance(value: unknown): BalanceSnapshot | null {
  const result = record(value)
  if (typeof result?.is_available !== 'boolean' || !Array.isArray(result.balance_infos) || !result.balance_infos.length) return null
  const amounts: BalanceAmount[] = []
  for (const wallet of result.balance_infos) {
    const row = record(wallet)
    const parsed = amount(row?.currency, row?.total_balance)
    if (!parsed || amounts.some(({ currency }) => currency === parsed.currency)) return null
    amounts.push(parsed)
  }
  // is_available=false is still a successful query, including a real zero.
  return { source: 'api-key', amounts }
}

/** A failed or unusable primary result falls back; two failures clear prior data. */
export async function queryBalance(
  account: () => Promise<unknown>,
  apiKey: () => Promise<unknown>,
): Promise<BalanceSnapshot | null> {
  try {
    const result = accountBalance(await account())
    if (result) return result
  } catch { /* The independent API-key wallet can still be available. */ }
  try {
    return apiKeyBalance(await apiKey())
  } catch {
    return null
  }
}
