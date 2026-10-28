import assert from 'node:assert/strict'
import test from 'node:test'
import { DEFAULT_PREFERENCES, normalizePreferences } from '../src/preferences.ts'

test('obsolete hidden-area settings are discarded while valid behavior preferences survive', () => {
  const old = {
    animation: 'fast',
    expansion: 'click',
    hiddenRegions: ['below', 'logo', 'below'],
  }
  const normalized = normalizePreferences(old)

  assert.equal(normalized.animation, 'fast')
  assert.equal(normalized.expansion, 'click')
  assert.equal('hiddenRegions' in normalized, false)
  assert.equal(normalized.brandPosition, DEFAULT_PREFERENCES.brandPosition)
  assert.equal(normalized.globalNavigationPosition, DEFAULT_PREFERENCES.globalNavigationPosition)
  assert.equal(normalized.toolsPosition, DEFAULT_PREFERENCES.toolsPosition)
  assert.equal(normalized.layoutVersion, undefined)
})

test('explicit semantic layout values are accepted and invalid values fall back safely', () => {
  const configured = normalizePreferences({
    brandPosition: 'sidebar-top',
    globalNavigationPosition: 'conversation-top',
    toolsPosition: 'conversation-bottom',
    layoutVersion: 1,
  })
  assert.equal(configured.brandPosition, 'sidebar-top')
  assert.equal(configured.globalNavigationPosition, 'conversation-top')
  assert.equal(configured.toolsPosition, 'conversation-bottom')
  assert.equal(configured.layoutVersion, 1)

  const invalid = normalizePreferences({
    brandPosition: 'above',
    globalNavigationPosition: 'hidden',
    toolsPosition: 'none',
  })
  assert.equal(invalid.brandPosition, DEFAULT_PREFERENCES.brandPosition)
  assert.equal(invalid.globalNavigationPosition, DEFAULT_PREFERENCES.globalNavigationPosition)
  assert.equal(invalid.toolsPosition, DEFAULT_PREFERENCES.toolsPosition)
})
