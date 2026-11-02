import type { Context } from '@deepseek-ai/cordis'
import type { StoredEntry } from '@deepseek-ai/dsh-client-ui-slots'
import type { SidebarRootComponentProps } from '@deepseek-ai/dsh-client-ui-sidebar/client'
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import { createElement as h, useSyncExternalStore } from 'react'
import type { ComponentType } from 'react'
import type { SidebarPreferences } from '../preferences.js'

/**
 * rc.3 compatibility seam, not an official DSH decoration API.
 * Wrap only the native sidebar owner, retaining its entry identity and bound
 * renderSlot face. DSH still composes/owns every footer entry, store and error
 * boundary. This avoids copying providers or implementing a second renderer.
 * Installing/removing the boundary can remount the sidebar once; changing
 * preferences or navigation state keeps the same boundary and provider tree.
 */
export function connectNativeFooterState(ctx: Context) {
  let preferences: SidebarPreferences | undefined
  let compact = false
  let override = false
  const listeners = new Set<() => void>()
  const subscribe = (listener: () => void): (() => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }
  const snapshot = (): boolean => override
  const publish = (): void => {
    const next = compact && preferences?.showCompactPluginStatus === true && preferences.toolsPosition === 'rail-bottom'
    if (next === override) return
    override = next
    for (const listener of listeners) listener()
  }

  const stop = ctx.slots.inject('sidebar', () => {
    const wrapped = new Map<StoredEntry, { original: unknown; wrapper: unknown }>()
    let stopRefresh: (() => void) | undefined

    const refresh = (): void => {
      let changed = false
      for (const entry of ctx.slots.entries('sidebar')) {
        if (!entry.children?.['sidebar.footer.action'] || wrapped.has(entry)) continue
        const Original = entry.component as ComponentType<SidebarRootComponentProps>
        function SidebarWithFooterState(props: SidebarRootComponentProps) {
          const forceCompact = useSyncExternalStore(subscribe, snapshot, snapshot)
          const renderSlot: typeof props.renderSlot = (key, owner, options) => props.renderSlot(
            key,
            key === 'sidebar.footer.action' && forceCompact ? { ...owner, wide: false } : owner,
            options,
          )
          return h(Original, { ...props, renderSlot })
        }
        wrapped.set(entry, { original: entry.component, wrapper: SidebarWithFooterState })
        entry.component = SidebarWithFooterState
        changed = true
      }
      if (!changed) return
      // Registry changes are DSH's normal render invalidation mechanism. This
      // shadow never wins over the existing native owner or declares its seats.
      stopRefresh?.()
      const priority = Math.max(0, ...ctx.slots.entries('sidebar').map((entry) => entry.options.priority ?? 0)) + 1
      stopRefresh = ctx.slots.register({ name: 'sidebar', priority }, () => null)
    }
    const unsubscribe = ctx.slots.subscribe('sidebar', refresh)
    refresh()
    return () => {
      unsubscribe()
      for (const [entry, value] of wrapped) {
        if (entry.component === value.wrapper) entry.component = value.original
      }
      wrapped.clear()
      stopRefresh?.()
    }
  })

  return {
    setCompact(next: boolean) { compact = next; publish() },
    update(next: SidebarPreferences) { preferences = next; publish() },
    dispose() {
      compact = false
      publish()
      stop()
      listeners.clear()
    },
  }
}
