import assert from 'node:assert/strict'
import test from 'node:test'
import { clockLines, DEFAULT_CLOCK_DISPLAY, normalizeClockDisplay, toClockConfig } from '../src/clock-display.ts'

const afternoon = new Date(2026, 9, 31, 15, 59)
const midnight = new Date(2026, 9, 31, 0, 5)

test('clock display defaults to 24-hour month/day and ignores a non-hex color', () => {
  assert.deepEqual(normalizeClockDisplay(undefined), DEFAULT_CLOCK_DISPLAY)
  assert.deepEqual(normalizeClockDisplay({ hourCycle: '24', detail: 'year', color: 'red' }), DEFAULT_CLOCK_DISPLAY)
  assert.equal(normalizeClockDisplay({ color: '#abc' }).color, null)
  assert.equal(normalizeClockDisplay({ color: '#A1B2C3' }).color, '#a1b2c3')
  assert.deepEqual(toClockConfig({ hourCycle: 'h12', detail: 'none', color: '#A1B2C3' }), {
    hourCycle: 'h12',
    monthDay: false,
    weekday: false,
    color: '#a1b2c3',
  })
  assert.deepEqual(toClockConfig({ detail: 'weekday' }), {
    hourCycle: 'h23',
    monthDay: false,
    weekday: true,
    color: '',
  })
  assert.deepEqual(normalizeClockDisplay({ monthDay: true, weekday: false, detail: 'weekday' }), {
    hourCycle: 'h23',
    monthDay: false,
    weekday: true,
    color: null,
  })
  assert.deepEqual(normalizeClockDisplay({ monthDay: true, weekday: true, detail: 'none' }), {
    hourCycle: 'h23',
    monthDay: true,
    weekday: true,
    color: null,
  })
  assert.equal(toClockConfig(undefined).color, '')
})

test('12-hour mode marks afternoon and morning with P and A', () => {
  const english = clockLines(afternoon, 'en-US', { hourCycle: 'h12', monthDay: true, weekday: false, color: null })
  assert.equal(english.time, '03:59')
  assert.equal(english.period, 'P')
  assert.equal(english.monthDay, '10/31')
  assert.equal(english.weekday, null)
  assert.match(english.accessible, /PM/)

  const chinese = clockLines(afternoon, 'zh-CN', { hourCycle: 'h12', monthDay: false, weekday: true, color: '#112233' })
  assert.equal(chinese.time, '03:59')
  assert.equal(chinese.period, 'P')
  assert.equal(chinese.monthDay, null)
  assert.match(chinese.weekday, /六/)
  assert.match(chinese.accessible, /下午/)

  const both = clockLines(afternoon, 'zh-CN', { hourCycle: 'h23', monthDay: true, weekday: true, color: null })
  assert.equal(both.monthDay, '10/31')
  assert.match(both.weekday, /六/)

  const hidden = clockLines(midnight, 'en-US', { hourCycle: 'h12', monthDay: false, weekday: false, color: null })
  assert.equal(hidden.time, '12:05')
  assert.equal(hidden.period, 'A')
  assert.equal(hidden.monthDay, null)
  assert.equal(hidden.weekday, null)

  const full = clockLines(afternoon, 'en-US', DEFAULT_CLOCK_DISPLAY)
  assert.equal(full.time, '15:59')
  assert.equal(full.period, null)
  assert.equal(full.monthDay, '10/31')
  assert.equal(full.weekday, null)
})
