import type { SidebarPreferences } from '../preferences.js'

const DSH = {
  sidebarSlot: '[data-slot="sidebar"]',
  root: '.hHd-Xa_root',
  brand: ':scope > .hHd-Xa_logoRow',
  brandButton: '.hHd-Xa_brand',
  brandMark: '.hHd-Xa_brandMark',
  brandName: '.hHd-Xa_brandName',
  newSession: ':scope > .hHd-Xa_newSession',
  newSessionLabel: '.hHd-Xa_newSessionLabel',
  panelList: ':scope > .hHd-Xa_panelList',
  panelButton: '.hHd-Xa_panelRow',
  panelGlyph: '.hHd-Xa_panelGlyph',
  panelTitle: '.hHd-Xa_panelTitle',
  conversation: ':scope > .hHd-Xa_regionArea',
  tools: ':scope > .hHd-Xa_footArea',
  settingsTriggerRow: '.VOzbGW_triggerRow',
  collapse: '.hHd-Xa_toggle',
  dragStrip: ':scope > div[data-window-drag]:not(:has([data-slot]))',
} as const

const ROOT_MARK = 'data-dsh-better-left-sidebar-root'
const REGION_MARK = 'data-dsh-better-left-sidebar-region'
const ROW_MARK = 'data-dsh-better-left-sidebar-panel-row'
const GLYPH_MARK = 'data-dsh-better-left-sidebar-panel-glyph'
const TITLE_MARK = 'data-dsh-better-left-sidebar-panel-title'

export interface LayoutAnchors {
  root: HTMLElement
  brand: HTMLElement
  newSession: HTMLElement
  panelList: HTMLElement
  conversation: HTMLElement
  tools: HTMLElement
}

export interface LayoutAdapter {
  update(preferences: SidebarPreferences): void
  dispose(): void
}

export function sizeConversationNavigation(
  rootHeight: number,
  navigationTop: number,
  footerHeight: number,
  panelContentHeight: number,
): { panelHeight: number; conversationTop: number } {
  const height = Math.max(0, rootHeight)
  const top = Math.max(0, navigationTop)
  const footer = Math.max(0, footerHeight)
  const content = Math.max(0, panelContentHeight)
  const availableContentHeight = Math.max(0, height - top - footer - 8)
  const contentReserve = Math.min(112, availableContentHeight)
  const panelHeight = Math.min(content, Math.max(0, availableContentHeight - contentReserve))
  return {
    panelHeight,
    conversationTop: top + (panelHeight > 0 ? panelHeight + 8 : 0),
  }
}

/** The only module that knows DSH's version-specific sidebar DOM classes. */
export function connectLayoutAdapter(onRoot: (root: HTMLElement | undefined, anchorsChanged?: boolean) => void): LayoutAdapter {
  let preferences: SidebarPreferences | undefined
  let current: LayoutAnchors | undefined
  let candidateRoot: HTMLElement | undefined
  let observedSidebar: HTMLElement | undefined
  let childrenObserver: MutationObserver | undefined
  let measurementObserver: MutationObserver | undefined
  let collapseObserver: MutationObserver | undefined
  let hostObserver: MutationObserver | undefined
  let resizeObserver: ResizeObserver | undefined
  let measureFrame = 0
  let warnedFor = new WeakSet<HTMLElement>()

  const readAnchors = (root: HTMLElement): LayoutAnchors | undefined => {
    const brand = root.querySelector<HTMLElement>(DSH.brand)
    const newSession = root.querySelector<HTMLElement>(DSH.newSession)
    const panelList = root.querySelector<HTMLElement>(DSH.panelList)
    const conversation = root.querySelector<HTMLElement>(DSH.conversation)
    const tools = root.querySelector<HTMLElement>(DSH.tools)
    const missing = [
      !brand && 'brand row',
      !newSession && 'New Session action',
      !panelList && 'global panel list',
      !conversation && 'conversation/workspace region',
      !tools && 'footer tools region',
    ].filter(Boolean)
    if (missing.length > 0) {
      if (!warnedFor.has(root)) {
        console.warn(`[dsh-better-left-sidebar] DSH sidebar adapter is inactive: missing ${missing.join(', ')}.`)
        warnedFor.add(root)
      }
      return undefined
    }
    return { root, brand: brand!, newSession: newSession!, panelList: panelList!, conversation: conversation!, tools: tools! }
  }

  const writeRegion = (element: HTMLElement, region: string): void => {
    element.setAttribute(REGION_MARK, region)
  }

  const annotatePanelRows = (panelList: HTMLElement): void => {
    for (const row of panelList.querySelectorAll<HTMLElement>(DSH.panelButton)) {
      row.setAttribute(ROW_MARK, '')
      const glyph = row.querySelector<HTMLElement>(DSH.panelGlyph)
      const title = row.querySelector<HTMLElement>(DSH.panelTitle)
      if (glyph) glyph.setAttribute(GLYPH_MARK, '')
      if (title) title.setAttribute(TITLE_MARK, '')
      const label = row.getAttribute('aria-label')
      if (label && (!row.hasAttribute('title') || row.hasAttribute('data-dsh-better-left-sidebar-owned-title'))) {
        row.setAttribute('title', label)
        row.setAttribute('data-dsh-better-left-sidebar-owned-title', '')
      }
    }
  }

  const measure = (): void => {
    measureFrame = 0
    const anchors = current
    if (!anchors?.root.isConnected) return
    const heightOf = (element: HTMLElement): number => Math.ceil(Math.max(element.getBoundingClientRect().height, element.scrollHeight))
    const brandHeight = heightOf(anchors.brand)
    const sessionHeight = heightOf(anchors.newSession)
    const toolsHeight = Math.max(heightOf(anchors.tools), 36)
    const chrome = anchors.root.querySelector(DSH.dragStrip) ? 52 : 0
    const brandOnSidebar = preferences?.brandPosition === 'sidebar-top'
    const brandOnRail = preferences?.brandPosition === 'navigation-top'
    const sessionTop = chrome + 10 + (brandOnSidebar ? brandHeight + 8 : 0)
    const railGlobalTop = chrome + 10 + (brandOnRail ? brandHeight + 8 : 0)
    const conversationGlobalTop = sessionTop + sessionHeight + 8
    const panelRows = [...anchors.panelList.querySelectorAll<HTMLElement>(DSH.panelButton)]
    const rowHeight = panelRows.reduce((height, row) => height + Math.ceil(row.getBoundingClientRect().height), 0)
    const rowGap = Math.max(0, Number.parseFloat(getComputedStyle(anchors.panelList).rowGap) || 4)
    const bottomPad = preferences?.toolsPosition === 'conversation-bottom' ? toolsHeight + 8 : 0
    const panelContentHeight = panelRows.length > 0 ? rowHeight + (panelRows.length - 1) * rowGap : 0
    const conversationNavigation = preferences?.globalNavigationPosition === 'conversation-top'
    const conversationSizing = sizeConversationNavigation(
      anchors.root.getBoundingClientRect().height,
      conversationGlobalTop,
      bottomPad,
      panelContentHeight,
    )
    const panelHeight = conversationNavigation ? conversationSizing.panelHeight : panelContentHeight
    const conversationTop = conversationNavigation ? conversationSizing.conversationTop : conversationGlobalTop
    const navBottomReserve = preferences?.toolsPosition === 'rail-bottom' ? toolsHeight + 8 : 8
    const toggleReserve = preferences?.expansion === 'click' ? 44 : 0

    anchors.root.style.setProperty('--dsh-better-left-sidebar-chrome', `${chrome}px`)
    anchors.root.style.setProperty('--dsh-better-left-sidebar-brand-height', `${brandHeight}px`)
    anchors.root.style.setProperty('--dsh-better-left-sidebar-session-top', `${sessionTop}px`)
    anchors.root.style.setProperty('--dsh-better-left-sidebar-rail-global-top', `${railGlobalTop}px`)
    anchors.root.style.setProperty('--dsh-better-left-sidebar-conversation-global-top', `${conversationGlobalTop}px`)
    anchors.root.style.setProperty('--dsh-better-left-sidebar-global-height', `${panelHeight}px`)
    anchors.root.style.setProperty('--dsh-better-left-sidebar-tools-height', `${toolsHeight}px`)
    anchors.root.style.setProperty('--dsh-better-left-sidebar-conversation-top', `${conversationTop}px`)
    anchors.root.style.setProperty('--dsh-better-left-sidebar-conversation-bottom', `${bottomPad}px`)
    anchors.root.style.setProperty('--dsh-better-left-sidebar-nav-bottom-reserve', `${navBottomReserve + toggleReserve}px`)
  }

  const scheduleMeasure = (): void => {
    if (measureFrame) window.cancelAnimationFrame(measureFrame)
    measureFrame = window.requestAnimationFrame(measure)
  }

  const observeAnchors = (anchors: LayoutAnchors): void => {
    resizeObserver?.disconnect()
    measurementObserver?.disconnect()
    resizeObserver = new ResizeObserver(scheduleMeasure)
    for (const element of [anchors.root, anchors.brand, anchors.newSession, anchors.panelList, anchors.tools]) resizeObserver.observe(element)
    measurementObserver = new MutationObserver(scheduleMeasure)
    measurementObserver.observe(anchors.panelList, { childList: true, subtree: true })
    measurementObserver.observe(anchors.tools, { childList: true, subtree: true })
  }

  const sameAnchors = (a: LayoutAnchors, b: LayoutAnchors): boolean => a.root === b.root
    && a.brand === b.brand
    && a.newSession === b.newSession
    && a.panelList === b.panelList
    && a.conversation === b.conversation
    && a.tools === b.tools

  const releaseStaleAnchors = (previous: LayoutAnchors, next: LayoutAnchors): void => {
    const retained = new Set([next.brand, next.newSession, next.panelList, next.conversation, next.tools])
    for (const element of [previous.brand, previous.newSession, previous.panelList, previous.conversation, previous.tools]) {
      if (retained.has(element)) continue
      element.removeAttribute(REGION_MARK)
      element.querySelector<HTMLElement>(DSH.brandButton)?.removeAttribute('inert')
      element.querySelectorAll(`[${ROW_MARK}], [${GLYPH_MARK}], [${TITLE_MARK}], [data-dsh-better-left-sidebar-brand-mark], [data-dsh-better-left-sidebar-brand-name], [data-dsh-better-left-sidebar-session-label], [data-dsh-better-left-sidebar-settings-trigger-row]`).forEach((marked) => {
        for (const attribute of [ROW_MARK, GLYPH_MARK, TITLE_MARK, 'data-dsh-better-left-sidebar-brand-mark', 'data-dsh-better-left-sidebar-brand-name', 'data-dsh-better-left-sidebar-session-label', 'data-dsh-better-left-sidebar-settings-trigger-row']) marked.removeAttribute(attribute)
      })
      element.querySelectorAll('[data-dsh-better-left-sidebar-owned-title]').forEach((ownedTitle) => {
        ownedTitle.removeAttribute('title')
        ownedTitle.removeAttribute('data-dsh-better-left-sidebar-owned-title')
      })
    }
  }

  const apply = (anchors: LayoutAnchors, next: SidebarPreferences): void => {
    const { root, brand, newSession, panelList, conversation, tools } = anchors
    root.setAttribute(ROOT_MARK, '')
    root.dataset.dshBetterLeftSidebarBrandPosition = next.brandPosition
    root.dataset.dshBetterLeftSidebarGlobalPosition = next.globalNavigationPosition
    root.dataset.dshBetterLeftSidebarToolsPosition = next.toolsPosition
    root.dataset.dshBetterLeftSidebarExpansion = next.expansion
    root.dataset.dshBetterLeftSidebarHasDragStrip = String(Boolean(root.querySelector(DSH.dragStrip)))
    writeRegion(brand, 'brand')
    writeRegion(newSession, 'new-session')
    writeRegion(panelList, 'global-navigation')
    writeRegion(conversation, 'conversation')
    writeRegion(tools, 'tools')
    for (const row of tools.querySelectorAll<HTMLElement>(DSH.settingsTriggerRow)) {
      row.setAttribute('data-dsh-better-left-sidebar-settings-trigger-row', '')
    }

    const brandButton = brand.querySelector<HTMLElement>(DSH.brandButton)
    if (brandButton) brandButton.inert = next.brandPosition !== 'sidebar-top'
    const brandMark = brand.querySelector<HTMLElement>(DSH.brandMark)
    const brandName = brand.querySelector<HTMLElement>(DSH.brandName)
    if (brandMark) brandMark.setAttribute('data-dsh-better-left-sidebar-brand-mark', '')
    if (brandName) brandName.setAttribute('data-dsh-better-left-sidebar-brand-name', '')
    const newSessionLabel = newSession.querySelector<HTMLElement>(DSH.newSessionLabel)
    newSessionLabel?.setAttribute('data-dsh-better-left-sidebar-session-label', '')
    for (const collapse of root.querySelectorAll<HTMLElement>(DSH.collapse)) collapse.setAttribute('data-dsh-better-left-sidebar-obsolete-collapse', '')
    annotatePanelRows(panelList)
    scheduleMeasure()
  }

  const detach = (): void => {
    childrenObserver?.disconnect()
    measurementObserver?.disconnect()
    collapseObserver?.disconnect()
    resizeObserver?.disconnect()
    childrenObserver = undefined
    measurementObserver = undefined
    collapseObserver = undefined
    resizeObserver = undefined
    if (measureFrame) window.cancelAnimationFrame(measureFrame)
    measureFrame = 0
    if (current) {
      current.root.removeAttribute(ROOT_MARK)
      current.root.removeAttribute('data-dsh-better-left-sidebar-brand-position')
      current.root.removeAttribute('data-dsh-better-left-sidebar-global-position')
      current.root.removeAttribute('data-dsh-better-left-sidebar-tools-position')
      current.root.removeAttribute('data-dsh-better-left-sidebar-expansion')
      current.root.removeAttribute('data-dsh-better-left-sidebar-has-drag-strip')
      for (const element of [current.brand, current.newSession, current.panelList, current.conversation, current.tools]) {
        element.removeAttribute(REGION_MARK)
      }
      for (const custom of [
        '--dsh-better-left-sidebar-chrome', '--dsh-better-left-sidebar-brand-height', '--dsh-better-left-sidebar-session-top',
        '--dsh-better-left-sidebar-rail-global-top', '--dsh-better-left-sidebar-conversation-global-top', '--dsh-better-left-sidebar-global-height',
        '--dsh-better-left-sidebar-tools-height', '--dsh-better-left-sidebar-conversation-top', '--dsh-better-left-sidebar-conversation-bottom',
        '--dsh-better-left-sidebar-nav-bottom-reserve',
      ]) current.root.style.removeProperty(custom)
      current.brand.querySelector<HTMLElement>(DSH.brandButton)?.removeAttribute('inert')
      current.root.querySelectorAll(`[${ROW_MARK}], [${GLYPH_MARK}], [${TITLE_MARK}], [data-dsh-better-left-sidebar-brand-mark], [data-dsh-better-left-sidebar-brand-name], [data-dsh-better-left-sidebar-session-label], [data-dsh-better-left-sidebar-obsolete-collapse]`).forEach((element) => {
        for (const attribute of [ROW_MARK, GLYPH_MARK, TITLE_MARK, 'data-dsh-better-left-sidebar-brand-mark', 'data-dsh-better-left-sidebar-brand-name', 'data-dsh-better-left-sidebar-session-label', 'data-dsh-better-left-sidebar-obsolete-collapse']) element.removeAttribute(attribute)
      })
      current.root.querySelectorAll('[data-dsh-better-left-sidebar-settings-trigger-row]').forEach((element) => element.removeAttribute('data-dsh-better-left-sidebar-settings-trigger-row'))
      current.panelList.querySelectorAll('[data-dsh-better-left-sidebar-owned-title]').forEach((element) => {
        element.removeAttribute('title')
        element.removeAttribute('data-dsh-better-left-sidebar-owned-title')
      })
    }
    current = undefined
  }

  const subtreeHas = (node: Node, selector: string): boolean => {
    if (!(node instanceof Element)) return false
    return node.matches(selector) || Boolean(node.querySelector(selector))
  }

  const watchHost = (): void => {
    if (hostObserver) return
    hostObserver = new MutationObserver((records) => {
      const targetRoot = current?.root ?? candidateRoot
      const relevant = records.some((record) => {
        const target = record.target
        if (target === observedSidebar) return true
        if (target === targetRoot) return !current || record.type !== 'childList'
        if (target instanceof Element && (target.matches(DSH.sidebarSlot) || target.matches(DSH.root))) return true
        if (target instanceof Element && target.parentElement === targetRoot) return !current || record.type !== 'childList'
        return [...record.addedNodes, ...record.removedNodes].some((node) =>
          node === targetRoot || subtreeHas(node, DSH.sidebarSlot) || subtreeHas(node, DSH.root),
        )
      })
      if (relevant) attach()
    })
    hostObserver.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'data-slot'],
    })
  }

  const attach = (): boolean => {
    const sidebar = document.querySelector<HTMLElement>(DSH.sidebarSlot)
    const root = sidebar?.querySelector<HTMLElement>(DSH.root)
    if (!sidebar || !root) {
      if (current) {
        detach()
        onRoot(undefined)
      }
      observedSidebar = sidebar ?? undefined
      candidateRoot = undefined
      return false
    }
    observedSidebar = sidebar
    candidateRoot = root
    if (current?.root === root) {
      const refreshed = readAnchors(root)
      if (!refreshed) {
        detach()
        onRoot(undefined)
        return false
      }
      if (sameAnchors(current, refreshed)) {
        if (preferences) apply(refreshed, preferences)
        return true
      }
      releaseStaleAnchors(current, refreshed)
      current = refreshed
      observeAnchors(refreshed)
      if (preferences) apply(refreshed, preferences)
      onRoot(root, true)
      return true
    }
    detach()
    const anchors = readAnchors(root)
    if (!anchors) {
      onRoot(undefined)
      return false
    }
    current = anchors
    if (preferences) apply(anchors, preferences)
    onRoot(root)
    if (root.classList.contains('hHd-Xa_collapsed')) root.querySelector<HTMLButtonElement>(DSH.collapse)?.click()
    childrenObserver = new MutationObserver(() => {
      if (!current || current.root !== root) return
      attach()
    })
    childrenObserver.observe(root, { childList: true, subtree: true })
    collapseObserver = new MutationObserver(() => {
      if (root.classList.contains('hHd-Xa_collapsed')) root.querySelector<HTMLButtonElement>(DSH.collapse)?.click()
    })
    collapseObserver.observe(root, { attributes: true, attributeFilter: ['class'] })
    observeAnchors(anchors)
    return true
  }

  watchHost()
  attach()

  return {
    update(next) {
      preferences = next
      if (current) apply(current, next)
    },
    dispose() {
      hostObserver?.disconnect()
      hostObserver = undefined
      detach()
      candidateRoot = undefined
      observedSidebar = undefined
      onRoot(undefined)
    },
  }
}
