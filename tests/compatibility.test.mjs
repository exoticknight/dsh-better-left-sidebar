import assert from 'node:assert/strict'
import { test } from 'node:test'
import semver from 'semver'
import { chooseDshVersion, DEFAULT_DSH_VERSION, dshCompatibility } from '../scripts/dsh-version.mjs'

test('version selection falls back to the pinned DSH baseline and rejects invalid input', async () => {
  assert.equal(await chooseDshVersion(undefined, { interactive: false }), DEFAULT_DSH_VERSION)
  assert.equal(await chooseDshVersion(undefined, { interactive: true, ask: async () => '' }), DEFAULT_DSH_VERSION)
  assert.equal(await chooseDshVersion(undefined, { interactive: true, ask: async () => { throw new Error('EOF') } }), DEFAULT_DSH_VERSION)
  assert.equal(await chooseDshVersion(undefined, { interactive: true, ask: async () => '0.1.5-rc.2' }), '0.1.5-rc.2')
  assert.equal(await chooseDshVersion('0.2'), DEFAULT_DSH_VERSION)
  await assert.rejects(chooseDshVersion('latest'), /Invalid DSH version/)
  await assert.rejects(chooseDshVersion(undefined, { interactive: true, ask: async () => 'typo' }), /Invalid DSH version/)
})

test('compatibility admits prereleases only within the selected bounds', () => {
  const range = dshCompatibility('0.2.0-rc.2', '0.2.0-rc.1')
  assert.equal(semver.satisfies('0.2.0-rc.1', range, { includePrerelease: true }), true)
  assert.equal(semver.satisfies('0.2.0-rc.3', range, { includePrerelease: true }), false)
  assert.equal(semver.satisfies('0.2.0', range, { includePrerelease: true }), false)
  assert.throws(() => dshCompatibility('0.2.0-rc.1', '0.2.0'), /exceeds target/)
})
