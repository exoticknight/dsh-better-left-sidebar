import type {} from '@deepseek-ai/dsh-client-ui-slots'

export interface CompactFooterOwnerProps {
  /** Whether this compact footer item is currently visible. */
  active: boolean
}

export type CompactFooterSlotKey = 'dsh-better-left-sidebar.footer.compact'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface SlotMap {
    'dsh-better-left-sidebar.footer.compact': {
      kind: 'list'
      scope: 'root'
      owner: CompactFooterOwnerProps
    }
  }
}
