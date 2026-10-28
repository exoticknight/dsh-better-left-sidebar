import type { ExpansionMode, SidebarPreferences } from '../preferences.js'
import { createNavigationToggle } from './footer.js'
import { fallbackTranslate } from './i18n.js'

const NAV_REGION = '[data-dsh-better-left-sidebar-region="brand"], [data-dsh-better-left-sidebar-region="global-navigation"], [data-dsh-better-left-sidebar-region="tools"]'
const POPUP_SELECTOR = '[role="menu"], [role="listbox"], [role="dialog"], [data-menu-material]'
const ENTER_DELAY = 160
const CLOSE_DELAY = 210
const POPUP_PENDING_DELAY = 900

type Translate = (key: string) => string

export interface SidebarInteraction {
  setRoot(root: HTMLElement | undefined): void
  setPreferences(preferences: SidebarPreferences): void
  setTranslate(translate: Translate): void
  dispose(): void
}

/** Owns all temporary/pinned interaction state; layout code only changes intent. */
export function connectInteraction(): SidebarInteraction {
  let root: HTMLElement | undefined
  let preferences: SidebarPreferences | undefined
  let expansion: ExpansionMode = 'hover'
  let mode: 'compact' | 'temporary' | 'pinned' = 'compact'
  let translate: Translate = fallbackTranslate
  let pointerInside = false
  let focusInside = false
  let pointerTarget: EventTarget | null = null
  let focusTarget: EventTarget | null = null
  let enterTimer = 0
  let closeTimer = 0
  let popupTimer = 0
  let popupObserver: MutationObserver | undefined
  let knownPopups = new Set<Element>()
  let associatedPopups = new Set<Element>()
  let popupPending = false
  let toggle: HTMLButtonElement | undefined
  let resizeObserver: ResizeObserver | undefined
  let rootIdOwned = false
  let documentCleanup: (() => void) | undefined

  const classRoot = document.documentElement

  const isNavTarget = (target: EventTarget | null): boolean => {
    if (!root || !(target instanceof Element) || !root.contains(target)) return false
    const region = target.closest<HTMLElement>(NAV_REGION)
    if (!region) return false
    if (region.dataset.dshBetterLeftSidebarRegion === 'brand') return preferences?.brandPosition === 'navigation-top'
    if (region.dataset.dshBetterLeftSidebarRegion === 'global-navigation') return preferences?.globalNavigationPosition === 'rail'
    return preferences?.toolsPosition === 'rail-bottom'
  }

  const isPopupTarget = (target: EventTarget | null): boolean => {
    if (!(target instanceof Node)) return false
    for (const popup of associatedPopups) if (popup.isConnected && popup.contains(target)) return true
    return false
  }

  const visiblePopups = (): Element[] => [...document.querySelectorAll<Element>(POPUP_SELECTOR)].filter((popup) => {
    const node = popup as HTMLElement
    return !node.hidden && node.getAttribute('aria-hidden') !== 'true' && node.getClientRects().length > 0
  })

  const setMode = (next: 'compact' | 'temporary' | 'pinned'): void => {
    mode = next
    classRoot.classList.toggle('dsh-better-left-sidebar-expanded', next !== 'compact')
    classRoot.classList.toggle('dsh-better-left-sidebar-pinned', next === 'pinned')
    syncToggle()
  }

  const clearTimer = (timer: number): void => {
    if (timer) window.clearTimeout(timer)
  }

  const stopPopupTracking = (): void => {
    popupObserver?.disconnect()
    popupObserver = undefined
    if (popupTimer) window.clearTimeout(popupTimer)
    popupTimer = 0
    popupPending = false
    knownPopups = new Set()
    associatedPopups = new Set()
  }

  const popupTriggerInScope = (trigger: Element): boolean => {
    return isNavTarget(trigger) || isPopupTarget(trigger)
  }

  const syncPopups = (): void => {
    const visible = visiblePopups()
    for (const popup of [...associatedPopups]) {
      if (!popup.isConnected || !visible.includes(popup)) associatedPopups.delete(popup)
    }
    const controlledIds = new Set<string>()
    const scopes: ParentNode[] = []
    if (root) scopes.push(root)
    for (const popup of associatedPopups) scopes.push(popup)
    for (const scope of scopes) {
      for (const trigger of scope.querySelectorAll<HTMLElement>('[aria-controls][aria-expanded="true"], [aria-controls][data-state="open"]')) {
        const id = trigger.getAttribute('aria-controls')
        if (id && popupTriggerInScope(trigger)) controlledIds.add(id)
      }
    }
    for (const popup of visible) {
      if (!knownPopups.has(popup) || (popup.id && controlledIds.has(popup.id))) associatedPopups.add(popup)
    }
    knownPopups = new Set(visible)
    if (associatedPopups.size) {
      popupPending = false
      if (popupTimer) window.clearTimeout(popupTimer)
      popupTimer = 0
    }
    if (!associatedPopups.size && !popupPending) {
      stopPopupTracking()
      requestClose()
    }
  }

  const startPopupTracking = (trigger: HTMLElement): void => {
    const closesExistingPopup = (trigger.getAttribute('aria-expanded') === 'true' || trigger.getAttribute('data-state') === 'open')
      && associatedPopups.size > 0
    if (!popupObserver) {
      knownPopups = new Set(visiblePopups())
      popupPending = !closesExistingPopup
      popupObserver = new MutationObserver(syncPopups)
      popupObserver.observe(document.body, {
        attributes: true,
        attributeFilter: ['aria-expanded', 'aria-hidden', 'data-state', 'hidden', 'style'],
        childList: true,
        subtree: true,
      })
    } else {
      popupPending = !closesExistingPopup
      for (const popup of visiblePopups()) knownPopups.add(popup)
    }
    if (closesExistingPopup) {
      if (popupTimer) window.clearTimeout(popupTimer)
      popupTimer = 0
      return
    }
    if (popupTimer) window.clearTimeout(popupTimer)
    popupTimer = window.setTimeout(() => {
      popupTimer = 0
      popupPending = false
      syncPopups()
      if (!associatedPopups.size) {
        stopPopupTracking()
        requestClose()
      }
    }, POPUP_PENDING_DELAY)
  }

  const popupOwnsInteraction = (): boolean => {
    if (popupObserver) syncPopups()
    return popupPending || associatedPopups.size > 0
  }

  const clearEntryTimer = (): void => {
    clearTimer(enterTimer)
    enterTimer = 0
  }

  const clearCloseTimer = (): void => {
    clearTimer(closeTimer)
    closeTimer = 0
  }

  const expandTemporarily = (): void => {
    clearCloseTimer()
    if (mode !== 'pinned') setMode('temporary')
  }

  const scheduleEnter = (): void => {
    clearEntryTimer()
    if (expansion !== 'hover' || mode === 'pinned' || mode === 'temporary') return
    enterTimer = window.setTimeout(() => {
      enterTimer = 0
      if (pointerInside && expansion === 'hover') expandTemporarily()
    }, ENTER_DELAY)
  }

  const requestClose = (): void => {
    clearEntryTimer()
    if (mode === 'pinned' || pointerInside || focusInside || popupOwnsInteraction()) return
    clearCloseTimer()
    closeTimer = window.setTimeout(() => {
      closeTimer = 0
      if (mode !== 'pinned' && !pointerInside && !focusInside && !popupOwnsInteraction()) setMode('compact')
    }, CLOSE_DELAY)
  }

  const refreshStateFromTargets = (): void => {
    pointerInside = isNavTarget(pointerTarget) || isPopupTarget(pointerTarget)
    focusInside = isNavTarget(focusTarget) || isPopupTarget(focusTarget)
    if (focusInside) expandTemporarily()
    else if (pointerInside) scheduleEnter()
    else requestClose()
  }

  const updateTogglePosition = (): void => {
    if (!root || !toggle) return
    const rect = root.getBoundingClientRect()
    const tools = root.querySelector<HTMLElement>('[data-dsh-better-left-sidebar-region="tools"]')
    const toolReserve = preferences?.toolsPosition === 'rail-bottom' && tools ? Math.max(tools.getBoundingClientRect().height, tools.scrollHeight) + 8 : 0
    toggle.style.left = `${Math.round(rect.left + 10)}px`
    toggle.style.top = `${Math.max(rect.top + 8, Math.round(rect.bottom - 8 - 36 - toolReserve))}px`
  }

  const syncToggle = (): void => {
    if (!toggle) return
    const pinned = mode === 'pinned'
    const expanded = mode !== 'compact'
    const label = translate(pinned ? 'closeNavigation' : 'expandNavigation')
    toggle.setAttribute('aria-label', label)
    toggle.title = label
    toggle.setAttribute('aria-expanded', String(expanded))
    toggle.setAttribute('aria-pressed', String(pinned))
    toggle.querySelector<SVGPathElement>('[data-dsh-better-left-sidebar-toggle-chevron]')?.setAttribute(
      'd',
      expanded ? 'm14 9-3 3 3 3' : 'm14 9 3 3-3 3',
    )
    const full = toggle.querySelector<HTMLElement>('[data-dsh-better-left-sidebar-toggle-label]')
    if (full) full.textContent = label
    updateTogglePosition()
  }

  const createToggle = (): void => {
    if (!root || preferences?.expansion !== 'click' || toggle) return
    toggle = createNavigationToggle(onToggleClick)
    document.body.append(toggle)
    resizeObserver = new ResizeObserver(updateTogglePosition)
    resizeObserver.observe(root)
    const tools = root.querySelector<HTMLElement>('[data-dsh-better-left-sidebar-region="tools"]')
    if (tools) resizeObserver.observe(tools)
    window.addEventListener('resize', updateTogglePosition)
    window.addEventListener('scroll', updateTogglePosition, true)
    syncToggle()
  }

  const removeToggle = (): void => {
    if (!toggle) return
    toggle.removeEventListener('click', onToggleClick)
    toggle.remove()
    toggle = undefined
    resizeObserver?.disconnect()
    resizeObserver = undefined
    window.removeEventListener('resize', updateTogglePosition)
    window.removeEventListener('scroll', updateTogglePosition, true)
  }

  const onToggleClick = (): void => {
    if (mode === 'pinned') {
      clearEntryTimer()
      clearCloseTimer()
      pointerInside = false
      focusInside = false
      setMode('compact')
      return
    }
    clearEntryTimer()
    clearCloseTimer()
    setMode('pinned')
  }

  const onPointerOver = (event: PointerEvent): void => {
    const wasInside = pointerInside
    pointerTarget = event.target
    if (isNavTarget(event.target)) {
      pointerInside = true
      if (!wasInside && expansion === 'hover') scheduleEnter()
    } else if (isPopupTarget(event.target)) {
      pointerInside = true
      clearCloseTimer()
    } else {
      pointerInside = false
      requestClose()
    }
  }

  const onPointerOut = (event: PointerEvent): void => {
    const nextTarget = event.relatedTarget
    const entersNavigation = !pointerInside && isNavTarget(nextTarget)
    pointerTarget = nextTarget
    pointerInside = isNavTarget(nextTarget) || isPopupTarget(nextTarget)
    // pointerout precedes pointerover; schedule here before the next handler sees pointerInside=true.
    if (entersNavigation && expansion === 'hover') scheduleEnter()
    else if (!pointerInside) requestClose()
  }

  const onFocusIn = (event: FocusEvent): void => {
    focusTarget = event.target
    if (isNavTarget(event.target) || isPopupTarget(event.target)) {
      focusInside = true
      expandTemporarily()
    } else {
      focusInside = false
      requestClose()
    }
  }

  const onFocusOut = (event: FocusEvent): void => {
    focusTarget = event.relatedTarget
    focusInside = isNavTarget(event.relatedTarget) || isPopupTarget(event.relatedTarget)
    if (!focusInside) requestClose()
  }

  const onTriggerIntent = (event: Event): void => {
    const target = event.target as Element | null
    const trigger = target?.closest<HTMLElement>('[aria-haspopup], [aria-controls], [aria-expanded]')
    if (!trigger || !(isNavTarget(trigger) || isPopupTarget(trigger))) return
    startPopupTracking(trigger)
  }

  const onClickCapture = (event: MouseEvent): void => onTriggerIntent(event)
  const onKeyDownCapture = (event: KeyboardEvent): void => {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') onTriggerIntent(event)
  }

  const onDocumentPointerDown = (event: PointerEvent): void => {
    if (mode !== 'pinned' || toggle?.contains(event.target as Node) || isNavTarget(event.target) || isPopupTarget(event.target)) return
    pointerInside = false
    focusInside = false
    focusTarget = null
    clearEntryTimer()
    clearCloseTimer()
    setMode('compact')
  }

  const onDocumentKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape' || mode === 'compact' || event.defaultPrevented) return
    if (popupOwnsInteraction()) return
    clearEntryTimer()
    clearCloseTimer()
    pointerInside = false
    focusInside = false
    focusTarget = null
    setMode('compact')
  }

  const attachDocumentListeners = (): (() => void) => {
    document.addEventListener('pointerover', onPointerOver, true)
    document.addEventListener('pointerout', onPointerOut, true)
    document.addEventListener('focusin', onFocusIn, true)
    document.addEventListener('focusout', onFocusOut, true)
    document.addEventListener('click', onClickCapture, true)
    document.addEventListener('keydown', onKeyDownCapture, true)
    document.addEventListener('pointerdown', onDocumentPointerDown, true)
    document.addEventListener('keydown', onDocumentKeyDown)
    return () => {
      document.removeEventListener('pointerover', onPointerOver, true)
      document.removeEventListener('pointerout', onPointerOut, true)
      document.removeEventListener('focusin', onFocusIn, true)
      document.removeEventListener('focusout', onFocusOut, true)
      document.removeEventListener('click', onClickCapture, true)
      document.removeEventListener('keydown', onKeyDownCapture, true)
      document.removeEventListener('pointerdown', onDocumentPointerDown, true)
      document.removeEventListener('keydown', onDocumentKeyDown)
    }
  }

  documentCleanup = attachDocumentListeners()

  const setRoot = (next: HTMLElement | undefined): void => {
    if (next === root) return
    if (root && rootIdOwned && root.id === 'dsh-better-left-sidebar-navigation') root.removeAttribute('id')
    rootIdOwned = false
    removeToggle()
    root = next
    pointerInside = false
    focusInside = false
    pointerTarget = null
    focusTarget = null
    stopPopupTracking()
    setMode('compact')
    if (!root) return
    if (!root.id) {
      root.id = 'dsh-better-left-sidebar-navigation'
      rootIdOwned = true
    }
    createToggle()
  }

  return {
    setRoot,
    setPreferences(next) {
      const previous = preferences
      preferences = next
      expansion = next.expansion
      classRoot.setAttribute('data-dsh-better-left-sidebar-animation', next.animation)
      if (previous?.expansion !== next.expansion) {
        clearEntryTimer()
        clearCloseTimer()
        if (mode === 'pinned') setMode('compact')
        refreshStateFromTargets()
      } else {
        refreshStateFromTargets()
      }
      if (next.expansion === 'click') createToggle()
      else removeToggle()
      syncToggle()
    },
    setTranslate(next) {
      translate = next
      syncToggle()
    },
    dispose() {
      clearEntryTimer()
      clearCloseTimer()
      stopPopupTracking()
      documentCleanup?.()
      documentCleanup = undefined
      removeToggle()
      if (root && rootIdOwned && root.id === 'dsh-better-left-sidebar-navigation') root.removeAttribute('id')
      rootIdOwned = false
      root = undefined
      mode = 'compact'
      classRoot.classList.remove('dsh-better-left-sidebar-expanded', 'dsh-better-left-sidebar-pinned')
      classRoot.removeAttribute('data-dsh-better-left-sidebar-animation')
    },
  }
}
