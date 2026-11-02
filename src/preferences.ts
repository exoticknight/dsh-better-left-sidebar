export type AnimationMode = 'standard' | 'fast' | 'off'
export type ExpansionMode = 'hover' | 'click'
export type BrandPosition = 'navigation-top' | 'sidebar-top' | 'hidden'
export type GlobalNavigationPosition = 'rail' | 'conversation-top'
export type ToolsPosition = 'rail-bottom' | 'conversation-bottom'

export interface SidebarPreferences {
  animation: AnimationMode
  expansion: ExpansionMode
  brandPosition: BrandPosition
  globalNavigationPosition: GlobalNavigationPosition
  toolsPosition: ToolsPosition
  /** Set after the user explicitly chooses a layout or restores its defaults. */
  layoutVersion: 1 | undefined
}

export const DEFAULT_PREFERENCES: SidebarPreferences = {
  animation: 'standard',
  expansion: 'hover',
  brandPosition: 'navigation-top',
  globalNavigationPosition: 'rail',
  toolsPosition: 'rail-bottom',
  layoutVersion: undefined,
}

const BRAND_POSITIONS = new Set<BrandPosition>(['navigation-top', 'sidebar-top', 'hidden'])
const GLOBAL_POSITIONS = new Set<GlobalNavigationPosition>(['rail', 'conversation-top'])
const TOOLS_POSITIONS = new Set<ToolsPosition>(['rail-bottom', 'conversation-bottom'])

export function normalizePreferences(value: unknown): SidebarPreferences {
  const input = value && typeof value === 'object' ? value as Record<string, unknown> : {}
  const animation = input.animation === 'fast' || input.animation === 'off' ? input.animation : 'standard'
  const expansion = input.expansion === 'click' ? input.expansion : 'hover'
  const brandPosition = isChoice(input.brandPosition, BRAND_POSITIONS) ? input.brandPosition : DEFAULT_PREFERENCES.brandPosition
  const globalNavigationPosition = isChoice(input.globalNavigationPosition, GLOBAL_POSITIONS)
    ? input.globalNavigationPosition
    : DEFAULT_PREFERENCES.globalNavigationPosition
  const toolsPosition = isChoice(input.toolsPosition, TOOLS_POSITIONS) ? input.toolsPosition : DEFAULT_PREFERENCES.toolsPosition
  const layoutVersion = input.layoutVersion === 1 ? 1 : undefined
  return {
    animation,
    expansion,
    brandPosition,
    globalNavigationPosition,
    toolsPosition,
    layoutVersion,
  }
}

function isChoice<T extends string>(value: unknown, choices: ReadonlySet<T>): value is T {
  return typeof value === 'string' && choices.has(value as T)
}
