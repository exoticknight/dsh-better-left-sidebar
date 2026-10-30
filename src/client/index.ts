import type { Context as ClientContext } from '@deepseek-ai/cordis'
import css from './sidebar.css'
import { DEFAULT_PREFERENCES, normalizePreferences } from '../preferences.js'
import type { SidebarPreferences } from '../preferences.js'
import { connectInteraction } from './interaction.js'
import { fallbackTranslate } from './i18n.js'
import { connectLayoutAdapter } from './layout-adapter.js'
import { connectNavigation } from './navigation.js'
import { connectSettings } from './settings.js'

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

    const interaction = connectInteraction()
    const layout = connectLayoutAdapter((root, anchorsChanged) => interaction.setRoot(root, anchorsChanged))
    const applyPreferences = (value: unknown): void => {
      preferences = normalizePreferences(value)
      layout.update(preferences)
      interaction.setPreferences(preferences)
    }
    const applyTranslate = (next: (key: string) => string): void => {
      translate = next
      interaction.setTranslate(translate)
    }

    applyPreferences(DEFAULT_PREFERENCES)
    interaction.setTranslate(translate)
    const disposeNavigation = connectNavigation(ctx)
    connectSettings(ctx, applyPreferences, applyTranslate)

    return () => {
      disposeNavigation()
      layout.dispose()
      interaction.dispose()
      html.classList.remove('dsh-better-left-sidebar')
      style.remove()
    }
  }, 'better-left-sidebar: navigation shell')
}
