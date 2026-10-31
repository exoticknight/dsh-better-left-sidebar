import type { Context } from '@deepseek-ai/cordis'
import type { PropsRenderSlots, StoredEntry } from '@deepseek-ai/dsh-client-ui-slots'
import type { SidebarFooterActionOwnerProps } from '@deepseek-ai/dsh-client-ui-sidebar/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import { createElement as h, Fragment, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import type { CompactFooterSlotKey } from '../slots.js'
import { orderCompactWidgetEntries } from './compact-widget-preferences.js'
import type { CompactWidgetPreference } from './compact-widget-preferences.js'

const SLOT: CompactFooterSlotKey = 'dsh-better-left-sidebar.footer.compact'
const HOST_ID = 'dsh-better-left-sidebar.compact-host'

type HostProps = SidebarFooterActionOwnerProps & PropsRenderSlots<typeof SLOT>
type SurfaceChange = (count: number, active: boolean) => void

export interface CompactWidgetSurface {
  container: HTMLDivElement
  readonly count: number
  readonly active: boolean
  setActive(active: boolean): void
  setPreferences(preferences: readonly CompactWidgetPreference[]): void
  dispose(): void
}

/** Install the portal host under DSH's native footer action declaration. */
export function connectCompactWidgets(ctx: Context, onChange: SurfaceChange): CompactWidgetSurface {
  const container = document.createElement('div')
  container.dataset.dshBetterLeftSidebarRegion = 'compact-widgets'
  container.dataset.dshBetterLeftSidebarCompactWidgets = ''

  let active = true
  let count = 0
  let preferences: readonly CompactWidgetPreference[] = []
  let surfaceVersion = 0
  let disposed = false
  const surfaceListeners = new Set<() => void>()
  const subscribeSurface = (listener: () => void): (() => void) => {
    surfaceListeners.add(listener)
    return () => surfaceListeners.delete(listener)
  }
  const getSurfaceVersion = (): number => surfaceVersion
  const publishSurface = (): void => {
    surfaceVersion += 1
    for (const listener of surfaceListeners) listener()
  }
  const setActive = (next: boolean): void => {
    if (disposed || active === next) return
    active = next
    container.hidden = !next
    container.inert = !next
    publishSurface()
    onChange(count, active)
  }
  container.hidden = false
  container.inert = false

  const entries = (): readonly StoredEntry[] => ctx.slots.entriesOfSlot(SLOT)
  const orderedEntries = () => orderCompactWidgetEntries(
    entries().flatMap((entry) => typeof entry.options.id === 'string'
      ? [{ id: entry.options.id, order: entry.options.order, entry }]
      : []),
    preferences,
  )
  const readCount = (): number => orderedEntries().filter(({ enabled }) => enabled).length
  const publishCount = (): void => {
    count = readCount()
    onChange(count, active)
  }
  const publishEntries = (): void => {
    publishSurface()
    publishCount()
  }
  const unsubscribeEntries = ctx.slots.subscribe(SLOT, publishEntries)
  publishEntries()

  const subscribe = (listener: () => void): (() => void) => ctx.slots.subscribe(SLOT, listener)
  const getVersion = (): number => ctx.slots.getVersion(SLOT)

  function CompactHost(props: HostProps) {
    useSyncExternalStore(subscribe, getVersion, getVersion)
    useSyncExternalStore(subscribeSurface, getSurfaceVersion, getSurfaceVersion)
    const ordered = orderedEntries().filter(({ enabled }) => enabled)

    return createPortal(h(Fragment, null, ...ordered.map(({ entry, enabled: _enabled }) => {
      const id = entry.id
      return h('div', {
        key: id,
        className: 'dsh-better-left-sidebar-compact-widget-box',
        'data-dsh-better-left-sidebar-compact-widget': id,
      }, props.renderSlot(SLOT, { active }, { only: id }))
    })), container)
  }

  const stopHost = ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
    name: 'sidebar.footer.action',
    id: HOST_ID,
    label: 'Compact footer widgets',
    order: 0,
    children: {
      [SLOT]: { kind: 'list', scope: 'root' },
    },
  }, CompactHost))

  return {
    container,
    get count() { return count },
    get active() { return active },
    setActive,
    setPreferences(next) {
      if (disposed) return
      preferences = next
      publishSurface()
      publishCount()
    },
    dispose() {
      if (disposed) return
      disposed = true
      stopHost()
      unsubscribeEntries()
      surfaceListeners.clear()
      container.remove()
    },
  }
}
