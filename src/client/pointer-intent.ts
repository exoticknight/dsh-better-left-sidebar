import type { ExpansionMode } from '../preferences.js'

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
