// Host entry: runs in the DSH Node process. Bundled to lib/index.js as ESM.
// Services from DSH (settings, tools, webServer, systemPrompt, ...) are
// requested with ctx.inject so the plugin degrades when one is missing.
import type { Context, Volatile } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'

export const name = __PLUGIN_NAME__

export interface Config {
  animation: Volatile<'standard' | 'fast' | 'off'>
  expansion: Volatile<'hover' | 'click'>
  brandPosition: Volatile<'navigation-top' | 'sidebar-top' | 'hidden'>
  globalNavigationPosition: Volatile<'rail' | 'conversation-top'>
  toolsPosition: Volatile<'rail-bottom' | 'conversation-bottom'>
  layoutVersion: Volatile<1 | undefined>
}

export const Config = z.object({
  animation: z.union([
    z.const('standard'),
    z.const('fast'),
    z.const('off'),
  ]).default('standard').volatile().description('Sidebar animation speed.'),
  expansion: z.union([
    z.const('hover'),
    z.const('click'),
  ]).default('hover').volatile().description('How the navigation flyout opens.'),
  brandPosition: z.union([
    z.const('navigation-top'),
    z.const('sidebar-top'),
    z.const('hidden'),
  ]).default('navigation-top').volatile().description('Where the brand area appears.'),
  globalNavigationPosition: z.union([
    z.const('rail'),
    z.const('conversation-top'),
  ]).default('rail').volatile().description('Where global navigation appears.'),
  toolsPosition: z.union([
    z.const('rail-bottom'),
    z.const('conversation-bottom'),
  ]).default('rail-bottom').volatile().description('Where tools and status content appear.'),
  layoutVersion: z.const(1).volatile().description('Marks an explicitly selected semantic layout.'),
})

// Services this plugin cannot start without. Prefer ctx.inject([...], fn)
// inside apply() for optional services.
export const inject: string[] = []

export function apply(ctx: Context, _config: Config) {
  // Everything registered in an effect is disposed when the plugin unloads.
  ctx.effect(() => {
    console.info(`[${name}] ${__PLUGIN_VERSION__} loaded`)
    return () => console.info(`[${name}] unloaded`)
  })
}
