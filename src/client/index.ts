// Client entry: runs in the DSH web page. Bundled to lib/client.js.
// Declare required Cordis services in inject below. Declare module requests beyond
// DSH's built-in baseline in package.json dsh.client.external.

interface ClientContext {
  effect: (effect: () => (() => void) | void, label?: string) => void
}

// Client services this entry needs, e.g. ['slots', 'theme'].
export const inject: string[] = []

export function apply(ctx: ClientContext) {
  ctx.effect(() => {
    console.info(`[${__PLUGIN_NAME__}] client ${__PLUGIN_VERSION__} ready`)
  })
}
