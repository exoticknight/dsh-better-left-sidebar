import type { Context } from '@deepseek-ai/cordis'
import type { HostConnectionHandle } from '@deepseek-ai/dsh-client-connection'
import { clientRequestSchema } from '@deepseek-ai/dsh-client-connection'
import type {} from '@deepseek-ai/dsh-deepseek-account'
import type {} from '@deepseek-ai/dsh-settings'
import type {} from '@deepseek-ai/dsh-llm'
import { credentialRef } from '@deepseek-ai/dsh-credentials'
import { launchEnvironmentOf } from '@deepseek-ai/dsh-launch-environment'
import { APP_IDENTITY } from '@deepseek-ai/dsh-llm'
import { queryBalance } from '../balance.js'

/** Reuse the configured official route, including its launch-time URL override. */
export async function queryApiKeyBalance(ctx: Context, signal: AbortSignal): Promise<unknown> {
  const provider = ctx.get('llm')?.listConfigurableProviders().find(({ provider }) => provider === 'deepseek-official')
  const credentials = ctx.get('credentials')
  const settings = ctx.get('settings')
  if (!provider || !credentials || !settings) return null
  let profile: unknown = settings.describe({ redactSecrets: true }).find(({ ns }) => ns === provider.settingsNs)?.value
  for (const key of provider.settingsPath) {
    profile = profile && typeof profile === 'object' ? (profile as Record<string, unknown>)[key] : undefined
  }
  if (!profile || typeof profile !== 'object') return null
  const config = profile as Record<string, unknown>
  const baseURL = config.baseURL ?? launchEnvironmentOf(ctx).get('DEEPSEEK_BASE_URL')?.value ?? 'https://api.deepseek.com/anthropic'
  if (typeof baseURL !== 'string') return null
  const url = new URL(baseURL)
  if (url.origin !== 'https://api.deepseek.com' || url.username || url.password || url.search || url.hash) return null
  const reference = config.apiKeyEnv ?? 'DEEPSEEK_API_KEY'
  if (typeof reference !== 'string') return null
  const credential = await credentials.resolve(credentialRef(reference))
  if (!credential?.value) return null
  const response = await fetch('https://api.deepseek.com/user/balance', {
    headers: { Authorization: `Bearer ${credential.value}` },
    redirect: 'error',
    signal: AbortSignal.any([signal, AbortSignal.timeout(10_000)]),
  })
  if (!response.ok) return null
  return response.json()
}

/** Connection owns authentication/carriers/disposal; this snapshot is owner-only. */
export function connectBalance(ctx: Context): void {
  ctx.inject(['connection'], (host) => {
    const connection = host.get('connection') as HostConnectionHandle
    // The shared Gateway has one interceptor; rpc.handle has an upstream scoped
    // webServer-injection defect. Exact Fetch routes reuse Connection's trust,
    // owner-only admission, buffering and lifecycle without either coupling.
    host.effect(() => connection.fetch.register({
      path: '/api/betterLeftSidebar/balance', methods: ['POST'], requestBody: 'buffered',
      fetch: async (request) => {
        const parsed = clientRequestSchema.safeParse(await request.json())
        if (!parsed.success || parsed.data.method !== 'betterLeftSidebar/balance') return new Response('Bad request', { status: 400 })
        const { payload, rpcId } = parsed.data
        const signal = request.signal
        const input = payload && typeof payload === 'object' ? payload as Record<string, unknown> : {}
        const locale = typeof input.locale === 'string' ? input.locale : 'en'
        const timezoneOffsetSeconds = typeof input.timezoneOffsetSeconds === 'number' && Number.isFinite(input.timezoneOffsetSeconds)
          ? input.timezoneOffsetSeconds : 0
        const result = await queryBalance(
          async () => {
            signal.throwIfAborted()
            return host.get('deepseekAccount')?.getBalance({ version: APP_IDENTITY.version, locale, timezoneOffsetSeconds }) ?? null
          },
          async () => {
            signal.throwIfAborted()
            return queryApiKeyBalance(host, signal)
          },
        )
        return Response.json({ type: 'server-response', rpcId, result: { ok: true, value: result } })
      },
    }))
  })
}
