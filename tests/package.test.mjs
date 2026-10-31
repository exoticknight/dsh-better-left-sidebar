// Package-level contract tests. Run after `pnpm build`.
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import test from 'node:test'
import { Context } from '@deepseek-ai/cordis'
import semver from 'semver'

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const patch = fs.readFileSync('cordis.patch.yml', 'utf8')

test('development target and host compatibility metadata agree', () => {
  const range = pkg.peerDependencies['@deepseek-ai/dsh']
  assert.equal(pkg.engines.dsh, range)
  assert.ok(semver.valid(pkg.config.dshVersion))
  assert.ok(semver.satisfies(pkg.config.dshVersion, range, { includePrerelease: true }))
  assert.ok(semver.satisfies('0.2.1-rc.2', range, { includePrerelease: true }))
  assert.ok(semver.satisfies('0.2.1-rc.3', range, { includePrerelease: true }))
  assert.equal(semver.satisfies('0.2.2-rc.1', range, { includePrerelease: true }), false)
  assert.equal(pkg.peerDependenciesMeta['@deepseek-ai/dsh'].optional, true)
  assert.match(fs.readFileSync('pnpm-workspace.yaml', 'utf8'), /^autoInstallPeers: false$/m)
})

test('package metadata points at the bundle patch and entries', () => {
  assert.equal(pkg.type, 'module')
  assert.equal(pkg.dsh.bundle.patch, './cordis.patch.yml')
  assert.ok(pkg.files.includes('cordis.patch.yml'))
  assert.ok(pkg.keywords.includes('deepseek-harness'))
  assert.equal(pkg.exports['.'], './lib/index.js')
  if (pkg.dsh.client) assert.equal(pkg.exports['./client'], './lib/client.js')
  assert.deepEqual(pkg.exports['./slots'], { types: './lib/slots.d.ts' })
  assert.ok(pkg.files.includes('lib/slots.d.ts'))
  assert.match(fs.readFileSync('lib/slots.d.ts', 'utf8'), /export type CompactFooterSlotKey\s*=/)
})

test('Chinese and English plugin metadata is exported with the package', () => {
  assert.equal(pkg.exports['./locale/*.json'], './locale/*.json')
  assert.ok(pkg.files.includes('locale/*.json'))
  const en = JSON.parse(fs.readFileSync('locale/en.json', 'utf8'))
  const zh = JSON.parse(fs.readFileSync('locale/zh.json', 'utf8'))
  assert.deepEqual(Object.keys(zh.meta).sort(), Object.keys(en.meta).sort())
  for (const field of ['title', 'description']) {
    assert.equal(typeof en.meta[field], 'string')
    assert.ok(en.meta[field].length > 0)
    assert.equal(typeof zh.meta[field], 'string')
    assert.ok(zh.meta[field].length > 0)
  }
})

// `dsh plugin add` installs with pnpm 11 in the user's profile, which blocks
// lifecycle scripts and non-registry sub-dependencies and skips peers.
// See playbooks/reference/installing.md.
test('package installs cleanly into a DSH profile', () => {
  const lifecycle = ['preinstall', 'install', 'postinstall', 'prepare', 'prepack']
  for (const script of lifecycle)
    assert.equal(pkg.scripts?.[script], undefined, `remove the "${script}" script`)
  for (const [dep, spec] of Object.entries(pkg.dependencies ?? {}))
    assert.doesNotMatch(
      spec,
      /^(git|github:|https?:|file:|link:)|\.git(#|$)|\.tgz$/,
      `dependency ${dep} must come from the npm registry`,
    )
  for (const peer of Object.keys(pkg.peerDependencies ?? {}))
    assert.match(peer, /^@deepseek-ai\//, `peer ${peer} is not provided by DSH`)
})

// `github:` installs download GitHub's source archive, which drops
// export-ignore paths. Everything the package ships must survive it.
test('packaged files are not export-ignored', (t) => {
  const shipped = ['package.json', ...pkg.files, 'locale/en.json', 'locale/zh.json']
  const result = spawnSync('git', ['check-attr', 'export-ignore', '--', ...shipped], {
    encoding: 'utf8',
  })
  if (result.status !== 0) return t.skip('not a git checkout')
  const ignored = result.stdout
    .split('\n')
    .filter((line) => line.endsWith(': export-ignore: set'))
  assert.deepEqual(ignored, [], 'remove these from export-ignore in .gitattributes')
})

test('cordis patch inserts this package', () => {
  assert.match(patch, new RegExp(`^\\s+name: ${pkg.name}$`, 'm'))
})

test('host entry mounts and unloads in Cordis', async () => {
  const plugin = await import('../lib/index.js')
  assert.equal(plugin.name, pkg.name)
  assert.equal(typeof plugin.apply, 'function')
  const ctx = new Context()
  const fiber = await ctx.plugin(plugin, {})
  await fiber.dispose()
})

test('client bundle registers with the DSH module loader', async (t) => {
  if (!pkg.dsh.client) return t.skip('host-only plugin')
  const source = fs.readFileSync('lib/client.js', 'utf8')
  let loaded
  const window = { __ModuleLoader__: { load: (entry) => (loaded = entry) } }
  new Function('window', source)(window)
  assert.equal(loaded.id, pkg.name)
  const exports = loaded.factory(() => ({}))
  assert.equal(typeof exports.apply, 'function')
})
