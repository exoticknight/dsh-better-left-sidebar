import type { LocaleRuntime } from '@deepseek-ai/dsh-client-locale/client'
import { createElement as h, useEffect, useState, useSyncExternalStore } from 'react'
import { clockLines } from '../clock-display.js'
import type { ClockDisplay, ClockLines } from '../clock-display.js'
import type { CompactFooterOwnerProps } from '../slots.js'

interface ClockSource {
  subscribe(listener: () => void): () => void
  getSnapshot(): ClockDisplay
}

/** A minute-aligned clock in DSH's active language that sleeps with its compact box or page. */
export function createClockWidget(
  locale: Pick<LocaleRuntime, 'getSnapshot' | 'subscribe'>,
  clock: ClockSource,
) {
  const subscribeLocale = (listener: () => void): (() => void) => locale.subscribe(listener)
  const activeLocale = (): string => locale.getSnapshot().active

  return function ClockWidget({ active }: CompactFooterOwnerProps) {
    const now = useMinuteClock(active)
    const localeId = useSyncExternalStore(subscribeLocale, activeLocale, activeLocale)
    const display = useSyncExternalStore(clock.subscribe, clock.getSnapshot, clock.getSnapshot)
    return h(ClockFace, { now, lines: clockLines(now, localeId, display), color: display.color })
  }
}

/** Ticks on the minute while active and the page is visible. */
export function useMinuteClock(active: boolean): Date {
  const [now, setNow] = useState(() => new Date())

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

  return now
}

export function ClockFace(props: { now: Date; lines: ClockLines; color: string | null }) {
  const { now, lines, color } = props
  return h('div', { className: 'dsh-better-left-sidebar-clock' },
    h('time', {
      className: 'dsh-better-left-sidebar-clock-time',
      dateTime: now.toISOString(),
      'aria-hidden': 'true',
      style: color ? { color } : undefined,
    },
    lines.time,
    lines.period ? h('span', { className: 'dsh-better-left-sidebar-clock-period' }, lines.period) : null),
    lines.monthDay ? h('span', { className: 'dsh-better-left-sidebar-clock-date', 'aria-hidden': 'true' }, lines.monthDay) : null,
    lines.weekday ? h('span', { className: 'dsh-better-left-sidebar-clock-date', 'aria-hidden': 'true' }, lines.weekday) : null,
    h('span', { className: 'dsh-better-left-sidebar-visually-hidden' }, lines.accessible),
  )
}
