import assert from 'node:assert/strict'
import test from 'node:test'
import { Context } from '@deepseek-ai/cordis'
import { accountBalance, apiKeyBalance, queryBalance } from '../src/balance.ts'
import * as plugin from '../lib/index.js'

const account = {
  status: 'ready',
  value: [{ currency: 'CNY', balance: '0.1' }, { currency: 'USD', balance: '2' }],
  bonusWallets: [{ currency: 'CNY', balance: '0.2' }],
}
const api = { is_available: false, balance_infos: [{ currency: 'CNY', total_balance: '0.00' }] }

test('account totals include bonus wallets exactly; zero and separate currencies remain valid', () => {
  assert.deepEqual(accountBalance(account), {
    source: 'account', amounts: [{ currency: 'CNY', amount: '0.3' }, { currency: 'USD', amount: '2' }],
  })
  assert.deepEqual(apiKeyBalance(api), { source: 'api-key', amounts: [{ currency: 'CNY', amount: '0' }] })
  assert.equal(accountBalance({ ...account, value: [{ currency: 'CNY', balance: 'NaN' }] }), null)
  assert.equal(apiKeyBalance({ is_available: true, balance_infos: [] }), null)
})

test('account succeeds first, every unavailable/failed primary falls back, two failures clear the result', async () => {
  assert.equal((await queryBalance(async () => account, async () => assert.fail('must not query API key'))).source, 'account')
  for (const primary of [null, { status: 'failed' }, { status: 'ready', value: [], bonusWallets: [] }]) {
    assert.equal((await queryBalance(async () => primary, async () => api)).source, 'api-key')
  }
  assert.equal((await queryBalance(async () => { throw Error('offline') }, async () => api)).source, 'api-key')
  assert.equal(await queryBalance(async () => null, async () => { throw Error('offline') }), null)
})

test('currency order stays CNY then USD when upstream wallet order changes', () => {
  const reversedAccount = { ...account, value: [...account.value].reverse() }
  assert.deepEqual(accountBalance(reversedAccount), accountBalance(account))
  const currencies = [
    { currency: 'CNY', total_balance: '101.44' },
    { currency: 'USD', total_balance: '0' },
  ]
  assert.deepEqual(
    apiKeyBalance({ is_available: true, balance_infos: [...currencies].reverse() }),
    apiKeyBalance({ is_available: true, balance_infos: currencies }),
  )
})

test('Host registers an exact route, resolves configured credentials, skips nonofficial origins, and disposes', async (t) => {
  const ctx = new Context()
  let handler
  let disposed = false
  ctx.provide('connection', { fetch: { register(route) {
    assert.equal(route.path, '/api/betterLeftSidebar/balance')
    assert.deepEqual(route.methods, ['POST'])
    assert.equal(route.requestBody, 'buffered')
    handler = route.fetch
    return async () => { disposed = true }
  } } })
  ctx.provide('deepseekAccount', { getBalance: async () => account })
  ctx.provide('llm', { listConfigurableProviders: () => [{ provider: 'deepseek-official', settingsNs: 'custom-entry-id', settingsPath: ['profile'] }] })
  let baseURL = 'https://api.deepseek.com/anthropic'
  ctx.provide('settings', { describe: () => [{ ns: 'custom-entry-id', value: { profile: { baseURL, apiKeyEnv: 'CUSTOM_KEY_REF' } } }] })
  let resolved = 0
  ctx.provide('credentials', { resolve: async (ref) => {
    resolved++
    assert.equal(ref, 'CUSTOM_KEY_REF')
    return { value: 'fixture-key' }
  } })
  const fetch = t.mock.method(globalThis, 'fetch', async (url, init) => {
    assert.equal(url, 'https://api.deepseek.com/user/balance')
    assert.equal(init.redirect, 'error')
    assert.equal(init.headers.Authorization, 'Bearer fixture-key')
    return Response.json(api)
  })
  const fiber = await ctx.plugin(plugin, {})
  t.after(async () => { await fiber.dispose() })
  const request = (method) => new Request('http://localhost/api/betterLeftSidebar/balance', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'client-request', rpcId: 'balance-test', method, payload: { locale: 'zh', timezoneOffsetSeconds: 28800 } }),
  })
  const call = async () => {
    const response = await handler(request('betterLeftSidebar/balance'))
    const message = await response.json()
    assert.equal(message.rpcId, 'balance-test')
    return message.result
  }
  assert.equal((await call()).value.source, 'account')
  assert.equal(resolved, 0)
  assert.equal(fetch.mock.callCount(), 0)
  ctx.set('deepseekAccount', { getBalance: async () => null })
  assert.deepEqual((await call()).value, apiKeyBalance(api))
  assert.equal(resolved, 1)
  baseURL = 'https://gateway.example/anthropic'
  assert.equal((await call()).value, null)
  assert.equal(resolved, 1, 'skip credential resolution for unofficial routes')
  assert.equal((await handler(request('wrong/endpoint'))).status, 400)
  await fiber.dispose()
  assert.equal(disposed, true)
})
