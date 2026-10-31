import type { SidebarPreferences } from '../preferences.js'

/** Whether a rail region participates in expansion for the saved layout. */
export function isRailRegionEligible(region: string, preferences: SidebarPreferences | undefined): boolean {
  if (region === 'brand') return preferences?.brandPosition === 'navigation-top'
  if (region === 'global-navigation') return preferences?.globalNavigationPosition === 'rail'
  if (region === 'compact-widgets') return true
  if (region === 'tools') return preferences?.toolsPosition === 'rail-bottom'
  return false
}
