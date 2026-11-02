import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import { createElement as h, Fragment, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { CLOCK_WIDGET_ID, DEFAULT_CLOCK_DISPLAY, normalizeClockDisplay } from '../clock-display.js'
import type { ClockDisplay } from '../clock-display.js'
import { orderCompactWidgetEntries } from './compact-widget-preferences.js'
import type { CompactWidgetPreference } from './compact-widget-preferences.js'
import { createClockWidget } from './clock.js'
import { BALANCE_WIDGET_ID, createBalanceWidget } from './balance.js'
import type { BalanceReader } from './balance.js'
import { NAMESPACE } from './i18n.js'

export interface CompactWidgetSurface {
  container: HTMLDivElement
  readonly count: number
  readonly active: boolean
  setActive(active: boolean): void
  setPreferences(preferences: readonly CompactWidgetPreference[]): void
  setClock(display: ClockDisplay): void
  subscribeCatalog(listener: () => void): () => void
  getCatalogVersion(): number
  getCatalog(): CompactWidgetCatalogEntry[]
  dispose(): void
}

export type CompactWidgetPresentation = 'shown' | 'clipped' | 'inactive' | 'empty' | 'enabled' | 'disabled'

export interface CompactWidgetCatalogEntry {
  presentation: CompactWidgetPresentation
  id: string
  label: string
  order: number
  registrationIndex: number
}

/** First-party widgets share a private collection, not a public DSH slot. */
export function connectCompactWidgets(ctx: Context, onChange: (count: number, active: boolean) => void, readBalance: BalanceReader): CompactWidgetSurface {
  const container = document.createElement('div')
  container.dataset.dshBetterLeftSidebarRegion = 'compact-widgets'
  let active = false
  let preferences: readonly CompactWidgetPreference[] = []
  let clockDisplay: ClockDisplay = DEFAULT_CLOCK_DISPLAY
  let version = 0
  const listeners = new Set<() => void>()
  const subscribe = (listener: () => void): (() => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }
  const getVersion = (): number => version
  const widgets = [{
    id: CLOCK_WIDGET_ID,
    label: () => ctx.locale.bind(NAMESPACE)('clock'),
    render: createClockWidget(ctx.locale, { subscribe, getSnapshot: () => clockDisplay }),
  }, {
    id: BALANCE_WIDGET_ID,
    label: () => ctx.locale.bind(NAMESPACE)('balance'),
    render: createBalanceWidget(ctx.locale, readBalance),
  }]
  const ordered = () => orderCompactWidgetEntries(widgets, preferences)
  const count = (): number => ordered().filter(({ enabled }) => enabled).length
  const publish = (): void => {
    version += 1
    for (const listener of listeners) listener()
    onChange(count(), active)
  }
  const getCatalog = (): CompactWidgetCatalogEntry[] => widgets.map((widget, registrationIndex) => {
    const box = [...container.children].find((child) => child.getAttribute('data-dsh-better-left-sidebar-compact-widget') === widget.id)
    const enabled = preferences.find((item) => item.id === widget.id)?.enabled ?? true
    const presentation: CompactWidgetPresentation = !enabled ? 'disabled'
      : !active ? 'inactive'
      : !box ? 'enabled'
      : box.getBoundingClientRect().height === 0 ? 'empty'
      : box.hasAttribute('data-dsh-better-left-sidebar-compact-widget-clipped') ? 'clipped' : 'shown'
    return { id: widget.id, label: widget.label(), order: registrationIndex, registrationIndex, presentation }
  })
  let presentationSnapshot = ''
  const publishPresentation = (): void => {
    const next = JSON.stringify(getCatalog().map(({ id, presentation }) => [id, presentation]))
    if (next === presentationSnapshot) return
    presentationSnapshot = next
    publish()
  }
  const observer = new MutationObserver(publishPresentation)
  observer.observe(container, {
    childList: true, subtree: true, attributes: true,
    attributeFilter: ['data-dsh-better-left-sidebar-compact-widget-clipped'],
  })
  const resize = new ResizeObserver(publishPresentation)
  resize.observe(container)

  function WidgetHost() {
    useSyncExternalStore(subscribe, getVersion, getVersion)
    return createPortal(h(Fragment, null, ...ordered().filter(({ enabled }) => enabled).map(({ entry }) =>
      h('div', {
        key: entry.id,
        className: 'dsh-better-left-sidebar-compact-widget-box',
        'data-dsh-better-left-sidebar-compact-widget': entry.id,
      }, h(entry.render, { active })))), container)
  }

  // Reuse DSH's React lifecycle without adding DOM to its native footer outlet.
  const stopHost = ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
    name: 'sidebar.footer.action',
    id: 'dsh-better-left-sidebar.widgets',
    label: 'Sidebar widgets',
  }, WidgetHost))

  return {
    container,
    get count() { return count() },
    get active() { return active },
    setActive(next) {
      if (active === next) return
      active = next
      container.hidden = !next
      container.inert = !next
      publish()
    },
    setPreferences(next) {
      preferences = next
      publish()
    },
    setClock(next) {
      clockDisplay = normalizeClockDisplay(next)
      publish()
    },
    subscribeCatalog: subscribe,
    getCatalogVersion: getVersion,
    getCatalog,
    dispose() {
      observer.disconnect()
      resize.disconnect()
      stopHost()
      listeners.clear()
      container.remove()
    },
  }
}
