import assert from 'node:assert/strict'
import test from 'node:test'
import { DEFAULT_PREFERENCES } from '../src/preferences.ts'
import { isRailRegionEligible } from '../src/client/rail-region.ts'
import { fitCompactWidgets } from '../src/client/layout-adapter.ts'
import {
  orderCompactWidgetEntries,
  validateCompactWidgetPreferences,
} from '../src/client/compact-widget-preferences.ts'

test('compact widget preferences retain string ids and default malformed enablement to enabled', () => {
  const validated = validateCompactWidgetPreferences([
    { id: 'third-party.unknown', enabled: false },
    { id: 'temporary.provider' },
    { id: 'duplicate.id', enabled: false },
    { id: 'duplicate.id', enabled: true },
    { id: 42, enabled: false },
    null,
  ])

  assert.deepEqual(validated, [
    { id: 'third-party.unknown', enabled: false },
    { id: 'temporary.provider', enabled: true },
    { id: 'duplicate.id', enabled: false },
    { id: 'duplicate.id', enabled: true },
  ])
  assert.deepEqual(validateCompactWidgetPreferences({ id: 'not-an-array' }), [])
})

test('saved widgets lead in saved order; unsaved widgets use slot order and registration order', () => {
  const entries = [
    { id: 'new-late', order: 20 },
    { id: 'saved-second', order: 100 },
    { id: 'new-tied-a', order: 5 },
    { id: 'saved-first', order: -10 },
    { id: 'new-tied-b', order: 5 },
  ]
  const preferences = validateCompactWidgetPreferences([
    { id: 'missing-but-remembered', enabled: false },
    { id: 'saved-first', enabled: false },
    { id: 'saved-second', enabled: true },
  ])
  const ordered = orderCompactWidgetEntries(entries, preferences)

  assert.deepEqual(ordered.map(({ entry }) => entry.id), [
    'saved-first', 'saved-second', 'new-tied-a', 'new-tied-b', 'new-late',
  ])
  assert.deepEqual(ordered.map(({ enabled, saved }) => ({ enabled, saved })), [
    { enabled: false, saved: true },
    { enabled: true, saved: true },
    { enabled: true, saved: false },
    { enabled: true, saved: false },
    { enabled: true, saved: false },
  ])
  assert.equal(preferences[0].id, 'missing-but-remembered')
})

test('compact widgets keep whole boxes in order up to the height limit', () => {
  assert.deepEqual(fitCompactWidgets([33, 44, 20], 4, 112), { visible: 3, height: 105 })
  assert.deepEqual(fitCompactWidgets([56, 56, 20], 4, 112), { visible: 1, height: 56 })
  assert.deepEqual(fitCompactWidgets([33], 4, 20), { visible: 0, height: 0 })
  assert.deepEqual(fitCompactWidgets([], 4, 112), { visible: 0, height: 0 })
})

test('compact widget region is eligible independent of tools position', () => {
  for (const toolsPosition of ['rail-bottom', 'conversation-bottom']) {
    const preferences = { ...DEFAULT_PREFERENCES, toolsPosition }
    assert.equal(isRailRegionEligible('compact-widgets', preferences), true)
    assert.equal(isRailRegionEligible('tools', preferences), toolsPosition === 'rail-bottom')
  }
  assert.equal(isRailRegionEligible('compact-widgets', undefined), true)
  assert.equal(isRailRegionEligible('unknown', DEFAULT_PREFERENCES), false)
})
