import type { Context as ClientContext } from '@deepseek-ai/cordis'
import css from './sidebar.css'
import { normalizeClockDisplay } from '../clock-display.js'
import { DEFAULT_PREFERENCES, normalizePreferences } from '../preferences.js'
import type { SidebarPreferences } from '../preferences.js'
import { connectLayoutAdapter } from './layout-adapter.js'
import { connectNavigation } from './navigation.js'
import { connectSettings } from './settings.js'
import { connectCompactWidgets } from './compact-widgets.js'
import type { LayoutAdapter } from './layout-adapter.js'
import { validateCompactWidgetPreferences } from './compact-widget-preferences.js'

/** Adapt DSH-owned navigation surfaces without replacing their slot owners. */
export const inject: string[] = ['slots', 'locale', 'configForms']

export function apply(ctx: ClientContext): void {
  let preferences: SidebarPreferences = DEFAULT_PREFERENCES

  ctx.effect(() => {
    const html = document.documentElement
    const style = document.createElement('style')
    style.dataset.dshBetterLeftSidebar = ''
    style.textContent = css
    document.head.append(style)
    html.classList.add('dsh-better-left-sidebar')

    let layout: LayoutAdapter | undefined
    const compactWidgets = connectCompactWidgets(ctx, (count, active) => layout?.setCompactWidgets(count, active))
    layout = connectLayoutAdapter((root) => compactWidgets.setActive(Boolean(root)), compactWidgets.container)
    layout.setCompactWidgets(compactWidgets.count, compactWidgets.active)
    const applyPreferences = (value: unknown): void => {
      preferences = normalizePreferences(value)
      const config = value && typeof value === 'object' ? value as Record<string, unknown> : {}
      compactWidgets.setPreferences(validateCompactWidgetPreferences(config.compactWidgets))
      compactWidgets.setClock(normalizeClockDisplay(config.clock))
      layout.update(preferences)
    }
    applyPreferences(DEFAULT_PREFERENCES)
    const disposeNavigation = connectNavigation(ctx)
    connectSettings(ctx, compactWidgets, applyPreferences)

    return () => {
      disposeNavigation()
      layout.dispose()
      compactWidgets.dispose()
      html.classList.remove('dsh-better-left-sidebar')
      style.remove()
    }
  }, 'better-left-sidebar: navigation shell')
}
