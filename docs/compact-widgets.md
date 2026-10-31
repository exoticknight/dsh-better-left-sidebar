# Compact rail widgets

Compact rail widgets let a plugin show a small piece of useful information while the Better Left Sidebar navigation is collapsed. The sidebar plugin owns each widget's box, position, order, and enablement; the registering plugin owns the content inside the box.

## Register through the public slot

Install a release of Better Left Sidebar that includes the type-only `dsh-better-left-sidebar/slots` entry. The slot is a root-scoped list named `dsh-better-left-sidebar.footer.compact`. Each registration supplies a stable namespaced `id`, a user-facing `label`, and an optional numeric `order` (default `0`). The owner receives only `{ active: boolean }`.

The host declares the slot when it is available. Use `inject` so registration waits for that declaration and is disposed with the registering plugin's fiber:

```ts
import { createElement as h } from 'react'
import type { CompactFooterOwnerProps, CompactFooterSlotKey } from 'dsh-better-left-sidebar/slots'

const compactSlot: CompactFooterSlotKey = 'dsh-better-left-sidebar.footer.compact'

function StatusWidget({ active }: CompactFooterOwnerProps) {
  return h('span', { 'aria-label': 'Sync status' }, active ? 'Synced' : null)
}

ctx.slots.inject(compactSlot, () => ctx.slots.register({
  name: compactSlot,
  id: 'example.sync-status',
  label: () => t('syncStatus'),
  order: 20,
}, StatusWidget))
```

The type entry exports declarations only; it does not add a runtime slot constant. The host filters and renders registrations individually, preserving the slot's `id`, `label`, and `order` metadata. The `registrant` shown in settings is advisory metadata, not a verified identity.

## Keep widget content display-only

Widgets report information. Do not render buttons, links, inputs, menus, popovers, dialogs, or other focusable or interactive elements. The host sets `pointer-events: none` on the widget box so pointer input reaches the sidebar region instead. Keyboard focusability is a registrant responsibility; the host does not strip focusability from content. Provide readable text or an accessible description for non-text visuals.

Use `active` to pause work while the navigation is expanded. The host retains the component instance during temporary or pinned expansion, sets `active` to `false`, and hides the widget list with `hidden` and `inert`. Document visibility is separate: a widget with timers or background work should pause when `document.visibilityState` is not `visible` and refresh when it resumes.

The compact widget list is a navigation region in the rail for both `toolsPosition` settings. In hover mode, hovering or focusing it expands navigation after the normal delay. In click mode, hover does not expand navigation. The list scrolls within its rail allocation above the navigation controls.

The host entry lives in DSH's native `sidebar.footer.action` slot but renders only through a portal into a single plugin-owned container. It adds no DOM at the native footer outlet, leaving expanded footer actions in their DSH position. If DSH replaces the sidebar root, the adapter reattaches that same container rather than creating a new one.

## Registration and instance lifecycle

| Event | Host behavior | Widget consequence |
| --- | --- | --- |
| Plugin registers while the compact slot is declared | Adds the live registration to the catalog | Rendered when enabled and compact |
| A new id appears | Places it after saved ids, sorted by registration `order` (ties keep registration order) | Enabled by default until the user saves a preference |
| Navigation expands, temporarily or pinned | Sends `active: false`; hides the list with `hidden` and `inert` | Instance remains mounted |
| Navigation compacts | Shows the list and sends `active: true` | Existing instance resumes |
| User disables the widget | Stops rendering that id | Instance unmounts; registration remains in settings |
| User enables it again | Renders that id again | A fresh instance mounts |
| User changes order | Saves the displayed order and reorders keyed boxes | Existing instances remain mounted |
| Source plugin unloads | Removes its registration | Item disappears; its saved preference remains as “not loaded” |
| Source plugin registers again | Restores the live registration | Saved enablement and position apply again |
| A widget throws during render | DSH reports the entry error and abdicates that registration | Only the failed box disappears; settings shows the failure and reason. It returns when the source re-registers. |

Saved ids stay in their saved order. Registrations without a saved id follow them, sorted by `order` and then registration order. Unsaved registrations are enabled by default, including third-party widgets. The settings page edits this list through the plugin's regular save, discard, and conflict flow.
