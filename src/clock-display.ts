export type ClockHourCycle = 'h23' | 'h12'

/** `color` is a fixed `#rrggbb`. `null` uses the theme primary label color. */
export interface ClockDisplay {
  hourCycle: ClockHourCycle
  monthDay: boolean
  weekday: boolean
  color: string | null
}

/** Persisted shape. An empty `color` means the theme primary. */
export interface ClockConfig {
  hourCycle: ClockHourCycle
  monthDay: boolean
  weekday: boolean
  color: string
}

export const CLOCK_WIDGET_ID = 'dsh-better-left-sidebar.clock'

export const DEFAULT_CLOCK_DISPLAY: ClockDisplay = {
  hourCycle: 'h23',
  monthDay: true,
  weekday: false,
  color: null,
}

const HEX = /^#[0-9a-fA-F]{6}$/

export interface ClockLines {
  time: string
  period: string | null
  monthDay: string | null
  weekday: string | null
  accessible: string
}

export function normalizeClockDisplay(value: unknown): ClockDisplay {
  const input = value && typeof value === 'object' ? value as Record<string, unknown> : {}
  const hourCycle: ClockHourCycle = input.hourCycle === 'h12' ? 'h12' : 'h23'
  const raw = typeof input.color === 'string' ? input.color.trim() : ''
  return {
    hourCycle,
    ...clockModules(input),
    color: HEX.test(raw) ? raw.toLowerCase() : null,
  }
}

export function toClockConfig(value: unknown): ClockConfig {
  const display = normalizeClockDisplay(value)
  return {
    hourCycle: display.hourCycle,
    monthDay: display.monthDay,
    weekday: display.weekday,
    color: display.color ?? '',
  }
}

/** Visible lines plus the accessible sentence. 12-hour mode adds P or A on the time line. */
export function clockLines(now: Date, locale: string, display: ClockDisplay): ClockLines {
  const tag = Intl.DateTimeFormat.supportedLocalesOf(locale).length > 0 ? locale : undefined
  const hourCycle = display.hourCycle
  const timeParts = new Intl.DateTimeFormat(tag, {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle,
  }).formatToParts(now)
  const hour = timeParts.find((part) => part.type === 'hour')?.value ?? '00'
  const minute = timeParts.find((part) => part.type === 'minute')?.value ?? '00'
  const period = hourCycle === 'h12' ? (now.getHours() >= 12 ? 'P' : 'A') : null
  return {
    time: `${hour}:${minute}`,
    period,
    monthDay: display.monthDay ? monthDayLine(now, tag) : null,
    weekday: display.weekday ? new Intl.DateTimeFormat(tag, { weekday: 'short' }).format(now) : null,
    accessible: new Intl.DateTimeFormat(tag, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle,
      timeZoneName: 'long',
    }).format(now),
  }
}

/**
 * Month/day and weekday are independent. A saved exclusive `detail` is used when
 * the booleans are still the defaults a schema would fill in beside that old field.
 */
function clockModules(input: Record<string, unknown>): { monthDay: boolean; weekday: boolean } {
  const legacy = input.detail === 'weekday' || input.detail === 'none'
  const explicit = input.monthDay === false || input.weekday === true
  if (legacy && !explicit) {
    return input.detail === 'weekday'
      ? { monthDay: false, weekday: true }
      : { monthDay: false, weekday: false }
  }
  return {
    monthDay: input.monthDay !== false,
    weekday: input.weekday === true,
  }
}

function monthDayLine(now: Date, tag: string | undefined): string {
  const dateParts = new Intl.DateTimeFormat(tag, { month: 'numeric', day: 'numeric' }).formatToParts(now)
  const month = dateParts.find((part) => part.type === 'month')?.value ?? String(now.getMonth() + 1)
  const day = dateParts.find((part) => part.type === 'day')?.value ?? String(now.getDate())
  return `${month}/${day}`
}

