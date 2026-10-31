# Compact rail widgets

Compact rail widgets let a plugin show a small piece of useful information while the Better Left Sidebar navigation is collapsed. The sidebar plugin owns each widget's box, position, order, and enablement; the registering plugin owns the content inside the box.

## Register through the public slot

Install a release of Better Left Sidebar that includes the type-only `dsh-better-left-sidebar/slots` entry. The slot is a root-scoped list named `dsh-better-left-sidebar.footer.compact`. Each registration supplies a stable namespaced `id`, a user-facing `label`, and an optional numeric `order` (default `0`). The owner receives only `{ active: boolean }`.

The host declares the slot when it is available. Use `inject` so registration waits for that declaration and is disposed with the registering plugin's fiber:

```ts
import { createElement as h } from 'react'
import type { CompactFooterOwnerProps, CompactFooterSlotKey } from 'dsh-better-left-sidebar/slots'

const compactSlot: CompactFooterSlotKey = 'dsh-better-left-sidebar.footer.compact'

function StatusWidget(_props: CompactFooterOwnerProps) {
  return h('span', null, 'Synced')
}

ctx.slots.inject(compactSlot, () => ctx.slots.register({
  name: compactSlot,
  id: 'example.sync-status',
  label: () => t('syncStatus'),
  order: 20,
}, StatusWidget))
```

The type entry exports declarations only; it does not add a runtime slot constant. It augments `@deepseek-ai/dsh-client-ui-slots`, so that package must be resolvable in your TypeScript project for the slot types to merge. The host filters and renders registrations individually, preserving the slot's `id`, `label`, and `order` metadata. Settings shows each widget by `label`; the secondary **Widget information and developer guide** disclosure lists its `id`. DSH `0.2.1-rc.3` does not attribute a registration made inside an `inject` callback to the registering plugin, so prefix the `id` with your plugin name; that is how users tell widgets apart.

## Keep widget content display-only

Widgets report information. Do not render buttons, links, inputs, menus, popovers, dialogs, or other focusable or interactive elements. The host sets `pointer-events: none` on the widget box so pointer input reaches the sidebar region instead. Keyboard focusability is a registrant responsibility; the host does not strip focusability from content. Provide readable text or an accessible description for non-text visuals.

Use `active` to pause work while the navigation is expanded. The host retains the component instance during temporary or pinned expansion, sets `active` to `false`, and hides the widget list with `hidden` and `inert`. Document visibility is separate: a widget with timers or background work should pause when `document.visibilityState` is not `visible` and refresh when it resumes.

The compact widget list is a navigation region in the rail for both `toolsPosition` settings. In hover mode, hovering or focusing it expands navigation after the normal delay. In click mode, hover does not expand navigation.

## Widget box

This is the box contract. It is separate from the sidebar's layout preferences.

The host gives every widget the full width of the collapsed left rail. That rail is 56 px wide. A widget may use all of it.

The host does not assign a height. The widget's own content sets the box height.

The host does not add padding or a border, and it does not require the widget to draw either. There is no default inner inset and no default outer frame.

The list still has to sit above the rail's bottom controls. The host measures the boxes and keeps them whole, in the user's order, while they fit in the space that remains. The first box that does not fit, and every box after it, is not shown. The list does not scroll. A widget that renders nothing takes no space, so return `null` when there is nothing to report. Users choose which widgets appear by enabling and ordering them in settings. The settings row distinguishes **Hidden: not enough space** from a disabled widget; changing the draft order or enablement takes effect in the rail only after saving.

The built-in clock (`dsh-better-left-sidebar.clock`) is one widget under this contract. Users set its hour cycle, month/day, weekday, and time color in settings. Month/day and weekday are independent. Its preview uses the same full rail width, with no extra inset.

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
