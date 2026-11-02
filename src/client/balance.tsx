import type { LocaleRuntime } from '@deepseek-ai/dsh-client-locale/client'
import { createElement as h, useEffect, useState, useSyncExternalStore } from 'react'
import type { BalanceSnapshot } from '../balance.js'
import { selectBalanceCurrency } from '../balance-display.js'
import type { BalanceCurrency } from '../balance-display.js'
import { NAMESPACE } from './i18n.js'

export type BalanceReader = (signal: AbortSignal, currency: BalanceCurrency) => Promise<BalanceSnapshot | null>
export const BALANCE_WIDGET_ID = 'dsh-better-left-sidebar.balance'

/** The empty state consumes no rail space. Pause requests with the box or page. */
export function createBalanceWidget(locale: LocaleRuntime, read: BalanceReader, currencySource: {
  subscribe(listener: () => void): () => void
  getSnapshot(): BalanceCurrency
}) {
  return function BalanceWidget({ active }: { active: boolean }) {
    const [balance, setBalance] = useState<BalanceSnapshot | null>(null)
    const localeId = useSyncExternalStore((listener) => locale.subscribe(listener), () => locale.getSnapshot().active)
    const currency = useSyncExternalStore(currencySource.subscribe, currencySource.getSnapshot)
    useEffect(() => {
      if (!active) return
      let timer = 0
      let request: AbortController | undefined
      let disposed = false
      const stop = (): void => {
        window.clearTimeout(timer)
        request?.abort()
        request = undefined
      }
      const refresh = async (): Promise<void> => {
        stop()
        if (disposed || document.hidden) return
        const current = new AbortController()
        request = current
        try {
          const next = await read(current.signal, currency)
          if (!current.signal.aborted && !disposed) setBalance(next)
        } catch {
          if (!current.signal.aborted && !disposed) setBalance(null)
        } finally {
          if (!current.signal.aborted && !disposed && !document.hidden) timer = window.setTimeout(refresh, 60_000)
        }
      }
      const visibility = (): void => {
        if (document.hidden) stop()
        else void refresh()
      }
      document.addEventListener('visibilitychange', visibility)
      void refresh()
      return () => {
        disposed = true
        stop()
        document.removeEventListener('visibilitychange', visibility)
      }
    }, [active, currency])

    const selected = selectBalanceCurrency(balance, currency)
    if (!selected) return null
    const amount = selected.amounts[0]!
    const t = locale.bind(NAMESPACE)
    const source = t(selected.source === 'account' ? 'balanceAccount' : 'balanceApiKey')
    const accessible = `${t('balance')}: ${amount.currency} ${amount.amount} (${source})`
    return h('div', { className: 'dsh-better-left-sidebar-balance', role: 'img', 'aria-label': accessible },
      h('span', { className: 'dsh-better-left-sidebar-balance-label', 'aria-hidden': true }, t(selected.source === 'api-key' ? 'balanceApiLabel' : 'balance')),
      h('span', {
        className: 'dsh-better-left-sidebar-balance-amount',
        'aria-hidden': true,
      }, formatBalanceAmount(amount.amount, amount.currency, localeId)))
  }
}

/** Keep sub-cent credit distinguishable from zero within the narrow rail. */
export function formatBalanceAmount(amount: string, currency: string, locale: string): string {
  const magnitude = Math.abs(Number(amount))
  const tiny = magnitude > 0 && magnitude < 0.001
  return new Intl.NumberFormat(locale, {
    style: 'currency', currency, currencyDisplay: 'narrowSymbol',
    notation: magnitude >= 10_000 ? 'compact' : tiny ? 'scientific' : 'standard',
    minimumFractionDigits: tiny ? 0 : 2,
    maximumFractionDigits: tiny ? 1 : magnitude > 0 && magnitude < 0.01 ? 3 : 2,
  }).format(Number(amount))
}
