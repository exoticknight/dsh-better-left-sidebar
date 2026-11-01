import type { ExpansionMode } from '../preferences.js'

export const NAVIGATION_TOGGLE_SIZE = 36
export const NAVIGATION_TOGGLE_GAP = 8

export function isHoverPointer(pointerType: string, hoverAvailable: boolean): boolean {
  return hoverAvailable && (pointerType === 'mouse' || pointerType === 'pen')
}

export function shouldShowNavigationToggle(
  expansion: ExpansionMode,
  coarsePointerAvailable: boolean,
  hoverAvailable: boolean,
): boolean {
  return expansion === 'click' || coarsePointerAvailable || !hoverAvailable
}

export function getNavigationToggleReserve(
  expansion: ExpansionMode,
  coarsePointerAvailable: boolean,
  hoverAvailable: boolean,
): number {
  return shouldShowNavigationToggle(expansion, coarsePointerAvailable, hoverAvailable)
    ? NAVIGATION_TOGGLE_SIZE + NAVIGATION_TOGGLE_GAP
    : 0
}
