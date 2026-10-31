import type { LocaleRuntime } from '@deepseek-ai/dsh-client-locale/client'
import { createElement as h, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import type { CompactFooterOwnerProps } from '../slots.js'

interface ClockFormats {
  time: Intl.DateTimeFormat
  date: Intl.DateTimeFormat
  accessible: Intl.DateTimeFormat
}

function clockFormats(locale: string): ClockFormats {
  const tag = Intl.DateTimeFormat.supportedLocalesOf(locale).length > 0 ? locale : undefined
  return {
    time: new Intl.DateTimeFormat(tag, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }),
    date: new Intl.DateTimeFormat(tag, { month: 'numeric', day: 'numeric' }),
    accessible: new Intl.DateTimeFormat(tag, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
      timeZoneName: 'long',
    }),
  }
}

/** A minute-aligned clock in DSH's active language that sleeps with its compact box or page. */
export function createClockWidget(locale: Pick<LocaleRuntime, 'getSnapshot' | 'subscribe'>) {
  const subscribe = (listener: () => void): (() => void) => locale.subscribe(listener)
  const activeLocale = (): string => locale.getSnapshot().active

  return function ClockWidget({ active }: CompactFooterOwnerProps) {
    const [now, setNow] = useState(() => new Date())
    const localeId = useSyncExternalStore(subscribe, activeLocale, activeLocale)
    const formats = useMemo(() => clockFormats(localeId), [localeId])

    useEffect(() => {
      if (!active) return
      let timer = 0
      const clearTimer = (): void => {
        if (timer) window.clearTimeout(timer)
        timer = 0
      }
      const refresh = (): void => {
        clearTimer()
        const current = new Date()
        setNow(current)
        if (!document.hidden) timer = window.setTimeout(refresh, 60_000 - (current.getTime() % 60_000))
      }
      const onVisibilityChange = (): void => {
        if (document.hidden) clearTimer()
        else refresh()
      }

      document.addEventListener('visibilitychange', onVisibilityChange)
      if (!document.hidden) refresh()
      return () => {
        clearTimer()
        document.removeEventListener('visibilitychange', onVisibilityChange)
      }
    }, [active])

    const timeParts = formats.time.formatToParts(now)
    const hour = timeParts.find((part) => part.type === 'hour')?.value ?? '00'
    const minute = timeParts.find((part) => part.type === 'minute')?.value ?? '00'
    const dateParts = formats.date.formatToParts(now)
    const month = dateParts.find((part) => part.type === 'month')?.value ?? String(now.getMonth() + 1)
    const day = dateParts.find((part) => part.type === 'day')?.value ?? String(now.getDate())

    return h('div', { className: 'dsh-better-left-sidebar-clock' },
      h('time', { className: 'dsh-better-left-sidebar-clock-time', dateTime: now.toISOString(), 'aria-hidden': 'true' }, `${hour}:${minute}`),
      h('span', { className: 'dsh-better-left-sidebar-clock-date', 'aria-hidden': 'true' }, `${month}/${day}`),
      h('span', { className: 'dsh-better-left-sidebar-visually-hidden' }, formats.accessible.format(now)),
    )
  }
}
