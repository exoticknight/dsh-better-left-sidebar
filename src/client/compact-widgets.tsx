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
import { ClockWidget } from './clock.js'
import { NAMESPACE } from './i18n.js'

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
  subscribeCatalog(listener: () => void): () => void
  getCatalogVersion(): number
  getCatalog(): CompactWidgetCatalogEntry[]
  dispose(): void
}

export interface CompactWidgetCatalogEntry {
  id: string
  label: string
  order: number
  registrant?: string
  error?: string
  registrationIndex: number
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
  const failures = new Map<string, { entry: StoredEntry; message: string }>()
  const metadata = (entry: StoredEntry, registrationIndex: number, error?: string): CompactWidgetCatalogEntry | undefined => {
    const id = entry.options.id
    if (typeof id !== 'string') return undefined
    let label = id
    try {
      const value = entry.options.label
      const resolved = typeof value === 'function' ? value() : value
      if (typeof resolved === 'string' && resolved.length > 0) label = resolved
    } catch {
      // A label is advisory metadata; keep the item identifiable by id.
    }
    const result: CompactWidgetCatalogEntry = {
      id,
      label,
      order: typeof entry.options.order === 'number' && Number.isFinite(entry.options.order) ? entry.options.order : 0,
      registrationIndex,
    }
    if (typeof entry.registrant === 'string') result.registrant = entry.registrant
    if (error !== undefined) result.error = error
    return result
  }
  const refreshFailures = (): void => {
    const live = new Map(entries().flatMap((entry) => typeof entry.options.id === 'string' ? [[entry.options.id, entry] as const] : []))
    for (const [id, failure] of failures) {
      const replacement = live.get(id)
      if (replacement && replacement !== failure.entry) failures.delete(id)
    }
  }
  const getCatalog = (): CompactWidgetCatalogEntry[] => {
    const all = ctx.slots.entries(SLOT)
    const live = entries()
    const visible = live.flatMap((entry) => {
      const index = all.indexOf(entry)
      const item = metadata(entry, index < 0 ? all.length : index)
      return item ? [item] : []
    })
    const liveIds = new Set(visible.map((entry) => entry.id))
    const failed = [...failures].flatMap(([id, failure]) => {
      if (liveIds.has(id)) return []
      const index = all.indexOf(failure.entry)
      const item = metadata(failure.entry, index < 0 ? all.length : index, failure.message)
      return item ? [item] : []
    })
    return [...visible, ...failed].sort((a, b) => a.registrationIndex - b.registrationIndex)
  }
  const getCatalogVersion = (): number => surfaceVersion
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
    refreshFailures()
    publishSurface()
    publishCount()
  }
  const unsubscribeEntries = ctx.slots.subscribe(SLOT, publishEntries)
  const unsubscribeErrors = ctx.slots.onEntryError((key, registration, error) => {
    if (key !== SLOT || !('options' in registration) || typeof registration.options.id !== 'string') return
    const entry = registration as StoredEntry
    failures.set(entry.options.id!, {
      entry,
      message: error instanceof Error ? error.message : String(error),
    })
    publishSurface()
  })
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
  const stopClock = ctx.slots.inject(SLOT, () => ctx.slots.register({
    name: SLOT,
    id: 'dsh-better-left-sidebar.clock',
    label: () => ctx.locale.bind(NAMESPACE)('clock'),
    order: 100,
  }, ClockWidget))

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
    subscribeCatalog: subscribeSurface,
    getCatalogVersion,
    getCatalog,
    dispose() {
      if (disposed) return
      disposed = true
      stopClock()
      stopHost()
      unsubscribeEntries()
      unsubscribeErrors()
      surfaceListeners.clear()
      container.remove()
    },
  }
}
