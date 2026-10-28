import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type { PluginDetailProps } from '@deepseek-ai/dsh-client-ui-plugin-manager/client'
import { createElement, useLayoutEffect, useRef } from 'react'

function scrollParent(element: Element): HTMLElement | undefined {
  for (let parent = element.parentElement; parent; parent = parent.parentElement) {
    if (/auto|scroll/.test(getComputedStyle(parent).overflowY)) return parent
  }
  return undefined
}

/** Use the detail lifecycle slot rather than replacing the plugin manager or its navigation. */
export function connectNavigation(ctx: Context): () => void {
  const listPositions = new WeakMap<HTMLElement, number>()
  let restoreFrame: number | undefined

  const rememberList = (event: MouseEvent): void => {
    const button = (event.target as Element | null)?.closest('li button[aria-label]')
    if (!button?.closest('[data-slot="main"]')?.querySelector('[data-slot="plugins.item"]')) return
    const container = scrollParent(button)
    if (container && !container.querySelector('[data-dsh-plugin-scroll]')) listPositions.set(container, container.scrollTop)
  }
  document.addEventListener('click', rememberList, true)

  function PluginScrollAnchor({ subject }: PluginDetailProps): ReturnType<typeof createElement> {
    const anchor = useRef<HTMLSpanElement>(null)
    const key = subject.kind === 'item' ? `item:${subject.id}` : `${subject.kind}:${subject.pkg.name}:${subject.kind === 'row' ? subject.row.rowId : ''}`
    useLayoutEffect(() => {
      if (restoreFrame !== undefined) window.cancelAnimationFrame(restoreFrame)
      const container = anchor.current && scrollParent(anchor.current)
      if (!container) return
      const previous = listPositions.get(container) ?? container.scrollTop
      container.scrollTop = 0
      return () => {
        restoreFrame = window.requestAnimationFrame(() => {
          restoreFrame = undefined
          if (container.isConnected && container.querySelector('[data-slot="plugins.item"]') && !container.querySelector('[data-dsh-plugin-scroll]')) container.scrollTop = previous
        })
      }
    }, [key])
    return createElement('span', { ref: anchor, hidden: true, 'data-dsh-plugin-scroll': '' })
  }

  const offDetails = ctx.slots.inject('plugins.detail.actions', () => ctx.slots.register({
    name: 'plugins.detail.actions',
    id: 'dsh-better-left-sidebar-scroll',
  }, PluginScrollAnchor))

  return () => {
    offDetails()
    document.removeEventListener('click', rememberList, true)
    if (restoreFrame !== undefined) window.cancelAnimationFrame(restoreFrame)
  }
}
