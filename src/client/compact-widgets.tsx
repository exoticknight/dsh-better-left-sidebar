import type { Context } from '@deepseek-ai/cordis'
import type { PropsRenderSlots, StoredEntry } from '@deepseek-ai/dsh-client-ui-slots'
import type { SidebarFooterActionOwnerProps } from '@deepseek-ai/dsh-client-ui-sidebar/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import { createElement as h, Fragment, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import type { CompactFooterSlotKey } from '../slots.js'

const SLOT: CompactFooterSlotKey = 'dsh-better-left-sidebar.footer.compact'
const HOST_ID = 'dsh-better-left-sidebar.compact-host'

type HostProps = SidebarFooterActionOwnerProps & PropsRenderSlots<typeof SLOT>
type SurfaceChange = (count: number, active: boolean) => void

export interface CompactWidgetSurface {
  container: HTMLDivElement
  readonly count: number
  readonly active: boolean
  setActive(active: boolean): void
  dispose(): void
}

/** Install the portal host under DSH's native footer action declaration. */
export function connectCompactWidgets(ctx: Context, onChange: SurfaceChange): CompactWidgetSurface {
  const container = document.createElement('div')
  container.dataset.dshBetterLeftSidebarRegion = 'compact-widgets'
  container.dataset.dshBetterLeftSidebarCompactWidgets = ''

  let active = true
  let count = 0
  let disposed = false
  const activeListeners = new Set<() => void>()
  const subscribeActive = (listener: () => void): (() => void) => {
    activeListeners.add(listener)
    return () => activeListeners.delete(listener)
  }
  const getActive = (): boolean => active
  const setActive = (next: boolean): void => {
    if (disposed || active === next) return
    active = next
    container.hidden = !next
    container.inert = !next
    for (const listener of activeListeners) listener()
    onChange(count, active)
  }
  container.hidden = false
  container.inert = false

  const entries = (): readonly StoredEntry[] => ctx.slots.entriesOfSlot(SLOT)
  const readCount = (): number => entries().filter((entry) => typeof entry.options.id === 'string').length
  const publishCount = (): void => {
    count = readCount()
    onChange(count, active)
  }
  const unsubscribeEntries = ctx.slots.subscribe(SLOT, publishCount)
  publishCount()

  const subscribe = (listener: () => void): (() => void) => ctx.slots.subscribe(SLOT, listener)
  const getVersion = (): number => ctx.slots.getVersion(SLOT)

  function CompactHost(props: HostProps) {
    useSyncExternalStore(subscribe, getVersion, getVersion)
    const visible = useSyncExternalStore(subscribeActive, getActive, getActive)
    const ordered = entries()
      .map((entry, registrationIndex) => ({ entry, registrationIndex }))
      .filter(({ entry }) => typeof entry.options.id === 'string')
      .sort((a, b) => (a.entry.options.order ?? 0) - (b.entry.options.order ?? 0)
        || a.registrationIndex - b.registrationIndex)

    return createPortal(h(Fragment, null, ...ordered.map(({ entry }) => {
      const id = entry.options.id!
      return h('div', {
        key: id,
        className: 'dsh-better-left-sidebar-compact-widget-box',
        'data-dsh-better-left-sidebar-compact-widget': id,
      }, props.renderSlot(SLOT, { active: visible }, { only: id }))
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
    dispose() {
      if (disposed) return
      disposed = true
      stopHost()
      unsubscribeEntries()
      activeListeners.clear()
      container.remove()
    },
  }
}
