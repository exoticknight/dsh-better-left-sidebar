import { createElement as h, useEffect, useState } from 'react'
import type { CompactFooterOwnerProps } from '../slots.js'

const timeFormat = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})
const dateFormat = new Intl.DateTimeFormat(undefined, { month: 'numeric', day: 'numeric' })
const accessibleFormat = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
  timeZoneName: 'long',
})

/** A minute-aligned, local clock that sleeps with its compact box or page. */
export function ClockWidget({ active }: CompactFooterOwnerProps) {
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

  const timeParts = timeFormat.formatToParts(now)
  const hour = timeParts.find((part) => part.type === 'hour')?.value ?? '00'
  const minute = timeParts.find((part) => part.type === 'minute')?.value ?? '00'
  const dateParts = dateFormat.formatToParts(now)
  const month = dateParts.find((part) => part.type === 'month')?.value ?? String(now.getMonth() + 1)
  const day = dateParts.find((part) => part.type === 'day')?.value ?? String(now.getDate())

  return h('div', { className: 'dsh-better-left-sidebar-clock' },
    h('time', { className: 'dsh-better-left-sidebar-clock-time', dateTime: now.toISOString(), 'aria-hidden': 'true' }, `${hour}:${minute}`),
    h('span', { className: 'dsh-better-left-sidebar-clock-date', 'aria-hidden': 'true' }, `${month}/${day}`),
    h('span', { className: 'dsh-better-left-sidebar-visually-hidden' }, accessibleFormat.format(now)),
  )
}
