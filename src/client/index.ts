import type { Context as ClientContext } from '@deepseek-ai/cordis'
import css from './sidebar.css'
import { normalizeClockDisplay } from '../clock-display.js'
import { DEFAULT_PREFERENCES, normalizePreferences } from '../preferences.js'
import type { SidebarPreferences } from '../preferences.js'
import { connectInteraction } from './interaction.js'
import { fallbackTranslate } from './i18n.js'
import { connectLayoutAdapter } from './layout-adapter.js'
import { connectNavigation } from './navigation.js'
import { connectSettings } from './settings.js'
import { connectCompactWidgets } from './compact-widgets.js'
import { connectNativeFooterState } from './native-footer-state.js'
import type { LayoutAdapter } from './layout-adapter.js'
import { validateCompactWidgetPreferences } from './compact-widget-preferences.js'

/** Adapt DSH-owned navigation surfaces without replacing their slot owners. */
export const inject: string[] = ['slots', 'locale', 'configForms']

export function apply(ctx: ClientContext): void {
  let preferences: SidebarPreferences = DEFAULT_PREFERENCES
  let translate: (key: string) => string = fallbackTranslate

  ctx.effect(() => {
    const html = document.documentElement
    const style = document.createElement('style')
    style.dataset.dshBetterLeftSidebar = ''
    style.textContent = css
    document.head.append(style)
    html.classList.add('dsh-better-left-sidebar')

    let layout: LayoutAdapter | undefined
    const nativeFooter = connectNativeFooterState(ctx)
    const interaction = connectInteraction((reserve) => layout?.setNavigationToggleReserve(reserve))
    const compactWidgets = connectCompactWidgets(ctx, (count, active) => layout?.setCompactWidgets(count, active))
    interaction.setCompactListener((active) => {
      compactWidgets.setActive(active)
      nativeFooter.setCompact(active)
    })
    layout = connectLayoutAdapter((root, anchorsChanged) => interaction.setRoot(root, anchorsChanged), compactWidgets.container)
    layout.setCompactWidgets(compactWidgets.count, compactWidgets.active)
    const applyPreferences = (value: unknown): void => {
      preferences = normalizePreferences(value)
      const config = value && typeof value === 'object' ? value as Record<string, unknown> : {}
      compactWidgets.setPreferences(validateCompactWidgetPreferences(config.compactWidgets))
      compactWidgets.setClock(normalizeClockDisplay(config.clock))
      layout.update(preferences)
      nativeFooter.update(preferences)
      interaction.setPreferences(preferences)
    }
    const applyTranslate = (next: (key: string) => string): void => {
      translate = next
      interaction.setTranslate(translate)
    }

    applyPreferences(DEFAULT_PREFERENCES)
    interaction.setTranslate(translate)
    const disposeNavigation = connectNavigation(ctx)
    connectSettings(ctx, compactWidgets, applyPreferences, applyTranslate)

    return () => {
      disposeNavigation()
      layout.dispose()
      nativeFooter.dispose()
      compactWidgets.dispose()
      interaction.dispose()
      html.classList.remove('dsh-better-left-sidebar')
      style.remove()
    }
  }, 'better-left-sidebar: navigation shell')
}
