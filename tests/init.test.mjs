import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'
import semver from 'semver'
import { chooseDshVersion, DEFAULT_DSH_VERSION, dshCompatibility } from '../scripts/dsh-version.mjs'

test('version selection asks when possible and falls back to the pinned 0.2 baseline', async () => {
  assert.equal(await chooseDshVersion(undefined, { interactive: false }), DEFAULT_DSH_VERSION)
  assert.equal(await chooseDshVersion(undefined, { interactive: true, ask: async () => '' }), DEFAULT_DSH_VERSION)
  assert.equal(await chooseDshVersion(undefined, { interactive: true, ask: async () => { throw new Error('EOF') } }), DEFAULT_DSH_VERSION)
  assert.equal(await chooseDshVersion(undefined, { interactive: true, ask: async () => '0.1.5-rc.2' }), '0.1.5-rc.2')
  assert.equal(await chooseDshVersion('0.2'), DEFAULT_DSH_VERSION)
  await assert.rejects(chooseDshVersion('latest'), /Invalid DSH version/)
  await assert.rejects(chooseDshVersion(undefined, { interactive: true, ask: async () => 'typo' }), /Invalid DSH version/)
})

test('compatibility admits prereleases only within the chosen bounds', () => {
  const range = dshCompatibility('0.2.0-rc.2', '0.2.0-rc.1')
  assert.equal(semver.satisfies('0.2.0-rc.1', range, { includePrerelease: true }), true)
  assert.equal(semver.satisfies('0.2.0-rc.3', range, { includePrerelease: true }), false)
  assert.equal(semver.satisfies('0.2.0', range, { includePrerelease: true }), false)
  assert.throws(() => dshCompatibility('0.2.0-rc.1', '0.2.0'), /exceeds target/)
})

function fixture(t) {
  const base = path.resolve('.tmp')
  fs.mkdirSync(base, { recursive: true })
  const root = fs.mkdtempSync(path.join(base, 'init-'))
  for (const item of ['scripts', 'src', '.template', 'docs', 'package.json', 'cordis.patch.yml', 'AGENTS.md'])
    fs.cpSync(path.resolve(item), path.join(root, item), { recursive: true })
  fs.mkdirSync(path.join(root, '.dsh-cli'))
  fs.writeFileSync(path.join(root, '.dsh-cli', 'untouched.md'), 'dsh-plugin-template')
  t.after(() => {
    assert.equal(path.dirname(root), base)
    assert.match(path.basename(root), /^init-/)
    fs.rmSync(root, { recursive: true, force: true })
  })
  return {
    root,
    run: (...args) => spawnSync(process.execPath, ['scripts/init.mjs', '--name', 'dsh-fixture', '--owner', 'fixture', ...args], { cwd: root, encoding: 'utf8' }),
    read: (p) => fs.readFileSync(path.join(root, p), 'utf8'),
  }
}

const initialized = !fs.existsSync('scripts/init.mjs')
test('noninteractive init produces bounded host admission and leaves isolated tools alone', { skip: initialized }, (t) => {
  const f = fixture(t)
  const result = f.run()
  assert.equal(result.status, 0, result.stderr)
  const pkg = JSON.parse(f.read('package.json'))
  assert.equal(pkg.config.dshVersion, DEFAULT_DSH_VERSION)
  assert.equal(pkg.engines.dsh, DEFAULT_DSH_VERSION)
  assert.equal(pkg.peerDependencies['@deepseek-ai/dsh'], DEFAULT_DSH_VERSION)
  assert.equal(pkg.peerDependenciesMeta['@deepseek-ai/dsh'].optional, true)
  assert.equal(f.read('.dsh-cli/untouched.md'), 'dsh-plugin-template')
  assert.doesNotMatch(f.read('docs/compatibility.md'), /\{\{[A-Z_]+\}\}/)
  assert.equal(fs.existsSync(path.join(f.root, 'scripts/init.mjs')), false)
})

test('explicit version, minimum, host-only and no-npm work together', { skip: initialized }, (t) => {
  const f = fixture(t)
  const result = f.run('--dsh-version', '0.2.0-rc.2', '--dsh-min', '0.2.0-rc.1', '--host-only', '--no-npm')
  assert.equal(result.status, 0, result.stderr)
  const pkg = JSON.parse(f.read('package.json'))
  assert.equal(pkg.engines.dsh, '>=0.2.0-rc.1 <=0.2.0-rc.2')
  assert.equal(pkg.dsh.client, undefined)
  assert.equal(pkg.exports['./client'], undefined)
  assert.doesNotMatch(f.read('README.en.md'), /From npm/)
})

test('invalid versions and dry runs do not mutate the scaffold', { skip: initialized }, (t) => {
  const f = fixture(t)
  const before = f.read('package.json')
  assert.equal(f.run('--dsh-version', '0.2', '--dsh-min', '0.3.0').status, 1)
  assert.equal(f.run('--dsh-version', 'latest').status, 1)
  assert.equal(f.run('--dry-run').status, 0)
  assert.equal(f.read('package.json'), before)
  assert.ok(fs.existsSync(path.join(f.root, 'scripts/init.mjs')))
})
