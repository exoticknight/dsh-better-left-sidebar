import type { Context } from '@deepseek-ai/cordis'
import { Button, Checkbox, SettingsForm, SettingsFormModel, Switch } from '@deepseek-ai/dsh-client-ui-primitives'
import type { SettingsFieldSpec, SettingsFormScope } from '@deepseek-ai/dsh-client-ui-primitives'
import type { PluginConfigViewProps } from '@deepseek-ai/dsh-client-ui-plugin-manager/client'
import type { Translate } from '@deepseek-ai/dsh-client-ui-slots'
import type { LocaleRuntime } from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-ui-slots'
import { createElement as h, useCallback, useEffect, useMemo, useSyncExternalStore } from 'react'
import { CLOCK_WIDGET_ID, clockLines, normalizeClockDisplay, toClockConfig } from '../clock-display.js'
import type { ClockDisplay } from '../clock-display.js'
import { ClockFace, useMinuteClock } from './clock.js'
import { DEFAULT_PREFERENCES, normalizePreferences } from '../preferences.js'
import type { BrandPosition, GlobalNavigationPosition, SidebarPreferences, ToolsPosition } from '../preferences.js'
import type { CompactWidgetCatalogEntry, CompactWidgetPresentation, CompactWidgetSurface } from './compact-widgets.js'
import { orderCompactWidgetEntries, validateCompactWidgetPreferences } from './compact-widget-preferences.js'
import type { CompactWidgetPreference } from './compact-widget-preferences.js'
import { messages, NAMESPACE } from './i18n.js'
import type { MessageKey } from './i18n.js'

const PACKAGE = 'dsh-better-left-sidebar'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    'dsh-better-left-sidebar': MessageKey
  }
}

type Copy = Translate<MessageKey>
type ConfigValues = Record<string, unknown>
type PageProps = PluginConfigViewProps & { t: Copy }
type LocaleSource = Pick<LocaleRuntime, 'getSnapshot' | 'subscribe'>
type BoundPageProps = PageProps & { ctx: Context; compactWidgets: CompactWidgetSurface; locale: LocaleSource }
type FieldStates = Record<string, ReturnType<SettingsFormModel<ConfigValues>['field']>>
type FormView = { shell: ReturnType<SettingsFormModel<ConfigValues>['shell']>; fields: FieldStates }

const animationValues = ['standard', 'fast', 'off'] as const
const expansionValues = ['hover', 'click'] as const
const brandValues = ['navigation-top', 'sidebar-top', 'hidden'] as const
const globalValues = ['rail', 'conversation-top'] as const
const toolsValues = ['rail-bottom', 'conversation-bottom'] as const
const fields = [
  choiceField('animation', animationValues),
  choiceField('expansion', expansionValues),
  choiceField('brandPosition', brandValues),
  choiceField('globalNavigationPosition', globalValues),
  choiceField('toolsPosition', toolsValues),
  compactWidgetField(),
  clockField(),
  {
    field: 'layoutVersion',
    format: (value: unknown) => value === 1 ? '1' : '',
    parse: (text: string) => text === '1' ? { kind: 'set' as const, value: 1 } : text === '' ? { kind: 'clear' as const } : undefined,
  },
] satisfies SettingsFieldSpec[]

function compactWidgetField(): SettingsFieldSpec {
  return {
    field: 'compactWidgets',
    format: (value) => JSON.stringify(validateCompactWidgetPreferences(value), null, 2),
    parse: (text) => {
      let value: unknown
      try {
        value = JSON.parse(text)
      } catch {
        return undefined
      }
      if (!Array.isArray(value) || value.some((item) => {
        if (!item || typeof item !== 'object' || Array.isArray(item)) return true
        const record = item as Record<string, unknown>
        return typeof record.id !== 'string' || typeof record.enabled !== 'boolean'
      })) return undefined
      return { kind: 'set', value: validateCompactWidgetPreferences(value) }
    },
  }
}

function clockField(): SettingsFieldSpec {
  return {
    field: 'clock',
    format: (value) => JSON.stringify(toClockConfig(value)),
    parse: (text) => {
      try {
        return { kind: 'set', value: toClockConfig(JSON.parse(text)) }
      } catch {
        return undefined
      }
    },
  }
}

function choiceField(field: string, values: readonly string[]): SettingsFieldSpec {
  return {
    field,
    format: (value) => typeof value === 'string' && values.includes(value) ? value : values[0]!,
    parse: (text) => values.includes(text) ? { kind: 'set', value: text } : undefined,
  }
}

export function connectSettings(
  ctx: Context,
  compactWidgets: CompactWidgetSurface,
  onPreferences: (value: unknown) => void,
  onTranslate: (translate: (key: string) => string) => void,
): void {
  ctx.inject(['locale', 'configForms'], (settingsCtx) => {
    const form = settingsCtx.configForms.get<ConfigValues>(PACKAGE)
    settingsCtx.effect(() => {
      const sync = (): void => onPreferences(form.getSnapshot().value)
      sync()
      return form.subscribe(sync)
    }, 'better-left-sidebar: profile preferences')
    settingsCtx.effect(
      () => settingsCtx.locale.register(NAMESPACE, messages),
      'better-left-sidebar: settings copy',
    )
    settingsCtx.effect(() => {
      const sync = (): void => onTranslate(settingsCtx.locale.bind(NAMESPACE) as unknown as (key: string) => string)
      sync()
      return settingsCtx.locale.subscribe(sync)
    }, 'better-left-sidebar: toggle copy')
    settingsCtx.effect(
      () => settingsCtx.slots.inject('plugins.bundle.config', () => settingsCtx.slots.register(
        { name: 'plugins.bundle.config', key: PACKAGE, locale: NAMESPACE },
        (props: PageProps) => h(SettingsPage, { ...props, ctx: settingsCtx, compactWidgets, locale: settingsCtx.locale }),
      )),
      'better-left-sidebar: settings page',
    )
  })
}

function SettingsPage(props: BoundPageProps) {
  const { ctx, t } = props
  const scope = useMemo(
    () => ctx.configForms.get<ConfigValues>(PACKAGE) as unknown as SettingsFormScope<ConfigValues>,
    [ctx],
  )
  const model = useMemo(() => new SettingsFormModel(scope, fields), [scope])
  useEffect(() => () => model.dispose(), [model])
  const store = useMemo(() => model.bind(() => ({
    shell: model.shell(),
    fields: Object.fromEntries(fields.map((spec) => [spec.field, model.field(spec.field)])),
  })), [model])
  const subscribe = useCallback((listener: () => void) => store.subscribe(listener), [store])
  const getSnapshot = useCallback(() => store.getSnapshot(), [store])
  const view = useSyncExternalStore(subscribe, getSnapshot, getSnapshot) as FormView
  useSyncExternalStore(props.compactWidgets.subscribeCatalog, props.compactWidgets.getCatalogVersion, props.compactWidgets.getCatalogVersion)
  const actions = useMemo(() => model.actions(), [model])
  const disabled = !view.shell.writable || view.shell.saving
  const savedSnapshot = scope.getSnapshot()
  const draft = normalizePreferences({
    ...savedSnapshot.value,
    animation: view.fields.animation?.text,
    expansion: view.fields.expansion?.text,
    brandPosition: view.fields.brandPosition?.text,
    globalNavigationPosition: view.fields.globalNavigationPosition?.text,
    toolsPosition: view.fields.toolsPosition?.text,
  })
  const userLayer = savedSnapshot.user && typeof savedSnapshot.user === 'object' ? savedSnapshot.user as Record<string, unknown> : {}
  const draftMatchesDefaults = sameLayout(draft, DEFAULT_PREFERENCES)
  const canRestore = !draftMatchesDefaults || userLayer.layoutVersion !== 1
  const setChoice = (field: string, value: string): void => {
    actions.edit(field, value)
    actions.edit('layoutVersion', '1')
  }
  const savedWidgets = readWidgetDraft(view.fields.compactWidgets?.text)
  const widgetRows = buildWidgetRows(savedWidgets, props.compactWidgets.getCatalog(), validateCompactWidgetPreferences(savedSnapshot.value?.compactWidgets))
  const writeWidgetRows = (rows: readonly CompactWidgetRow[]): void => {
    const next: CompactWidgetPreference[] = rows.map(({ id, enabled }) => ({ id, enabled }))
    actions.edit('compactWidgets', JSON.stringify(next, null, 2))
  }
  const clockDraft = readClockDraft(view.fields.clock?.text)
  const writeClock = (next: ClockDisplay): void => {
    actions.edit('clock', JSON.stringify(toClockConfig(next)))
  }

  if (props.view === 'summary') return h('p', null, t('summary'))

  const widgetSection = h('section', { className: 'dsh-better-left-sidebar-settings-group dsh-better-left-sidebar-compact-widgets-settings' },
        h('div', { className: 'dsh-better-left-sidebar-compact-widgets-intro' },
          h('h3', null, t('compactWidgets')),
          h('p', { className: 'dsh-better-left-sidebar-compact-widgets-hint' }, t('compactWidgetsHint'))),
        widgetRows.length === 0
          ? h('p', { className: 'dsh-better-left-sidebar-compact-widgets-empty' }, t('compactWidgetsEmpty'))
          : h('div', { className: 'dsh-better-left-sidebar-compact-widgets-list' },
            ...widgetRows.map((row, index) => h('div', {
              key: row.id,
              className: 'dsh-better-left-sidebar-compact-widget-setting',
              'data-dsh-better-left-sidebar-widget-setting': row.id,
            },
            h('div', { className: 'dsh-better-left-sidebar-compact-widget-info' },
              h('div', { className: 'dsh-better-left-sidebar-compact-widget-name' }, row.label),
              h('div', {
                className: `dsh-better-left-sidebar-compact-widget-status is-${row.status}`,
                'aria-live': 'polite',
              }, row.status === 'failed' ? `${t('widgetFailed')}: ${row.error}` : t(widgetStatusKey(row.status)))),
            h('div', { className: 'dsh-better-left-sidebar-compact-widget-controls' },
              h(Switch, {
                checked: row.enabled,
                disabled,
                label: `${t('widgetEnable')} ${row.label}`,
                onChange: (checked) => writeWidgetRows(widgetRows.map((item) =>
                  item.id === row.id ? { ...item, enabled: checked } : item)),
              }),
              widgetRows.length > 1 ? h('div', { className: 'dsh-better-left-sidebar-widget-order' },
                h(Button, {
                  type: 'button',
                  variant: 'outline',
                  size: 'sm',
                  disabled: disabled || index === 0,
                  'aria-label': `${t('moveUp')} ${row.label}`,
                  onClick: () => writeWidgetRows(moveWidgetRow(widgetRows, index, -1)),
                }, '↑'),
                h(Button, {
                  type: 'button',
                  variant: 'outline',
                  size: 'sm',
                  disabled: disabled || index === widgetRows.length - 1,
                  'aria-label': `${t('moveDown')} ${row.label}`,
                  onClick: () => writeWidgetRows(moveWidgetRow(widgetRows, index, 1)),
                }, '↓')) : null),
            row.id === CLOCK_WIDGET_ID
              ? h('details', { className: 'dsh-better-left-sidebar-widget-options', open: true },
                h('summary', null, t('widgetSettings')),
                h(ClockOptions, {
                  t, disabled, display: clockDraft, caption: t('effectPreview'),
                  locale: props.locale, onChange: writeClock,
                }))
              : null))),
        h('details', { className: 'dsh-better-left-sidebar-widget-reference' },
          h('summary', null, t('widgetInformation')),
          h('dl', null, ...widgetRows.flatMap((row) => [
            h('dt', { key: `${row.id}-label` }, row.label),
            h('dd', { key: row.id }, h('code', null, row.id)),
          ])),
          h('a', { href: t('compactWidgetsDocsUrl'), target: '_blank', rel: 'noopener noreferrer' }, t('compactWidgetsDocs'))))

  return h(SettingsForm, {
    labels: {
      unavailable: t('unavailable'),
      readOnly: t('readOnly'),
      saveFailed: t('saveFailed'),
      save: t('save'),
      saving: t('saving'),
    },
    state: view.shell,
    onSave: actions.save,
    onDiscard: actions.discard,
    children: [
      h('div', { className: 'dsh-better-left-sidebar-preferences' },
      h('section', { className: 'dsh-better-left-sidebar-settings-group dsh-better-left-sidebar-layout-settings' },
        h('div', { className: 'dsh-better-left-sidebar-settings-heading' },
          h('h3', null, t('contentLayout')),
          h('button', {
            type: 'button',
            className: 'dsh-better-left-sidebar-layout-reset',
            disabled: disabled || !canRestore,
            onClick: () => {
              actions.edit('brandPosition', DEFAULT_PREFERENCES.brandPosition)
              actions.edit('globalNavigationPosition', DEFAULT_PREFERENCES.globalNavigationPosition)
              actions.edit('toolsPosition', DEFAULT_PREFERENCES.toolsPosition)
              actions.edit('layoutVersion', '1')
            },
          }, t('resetLayout'))),
        h('div', { className: 'dsh-better-left-sidebar-position-controls' },
          h(PositionSelect, {
            field: 'brandPosition', label: t('brand'), value: view.fields.brandPosition!.text, disabled,
            options: brandValues.map((value) => ({ value, label: brandLabel(t, value) })),
            onChange: (value: string) => setChoice('brandPosition', value as BrandPosition),
          }),
          h(PositionSelect, {
            field: 'globalNavigationPosition', label: t('globalNavigation'), value: view.fields.globalNavigationPosition!.text, disabled,
            options: globalValues.map((value) => ({ value, label: globalLabel(t, value) })),
            onChange: (value: string) => setChoice('globalNavigationPosition', value as GlobalNavigationPosition),
          }),
          h(PositionSelect, {
            field: 'toolsPosition', label: t('tools'), value: view.fields.toolsPosition!.text, disabled,
            options: toolsValues.map((value) => ({ value, label: toolsLabel(t, value) })),
            onChange: (value: string) => setChoice('toolsPosition', value as ToolsPosition),
          })),
        h(LayoutPreview, { title: t('effectPreview'), preferences: draft, t })),
      h('section', { className: 'dsh-better-left-sidebar-settings-group' },
        h('h3', null, t('navigationBehavior')),
        h(ChoiceRow, {
          name: 'dsh-better-left-sidebar-expansion',
          label: t('expansion'),
          value: view.fields.expansion!.text,
          disabled,
          options: expansionValues.map((value) => ({ value, label: t(value) })),
          onChange: (value: string) => actions.edit('expansion', value),
        }),
        h(ChoiceRow, {
          name: 'dsh-better-left-sidebar-animation',
          label: t('animation'),
          value: view.fields.animation!.text,
          disabled,
          options: animationValues.map((value) => ({ value, label: t(value) })),
          onChange: (value: string) => actions.edit('animation', value),
        })),
      widgetSection),
    view.shell.dirty ? h('button', {
      type: 'button',
      className: 'dsh-better-left-sidebar-layout-cancel',
      disabled: view.shell.saving,
      onClick: actions.discard,
    }, t('cancel')) : null,
    ],
  })
}

function sameLayout(a: SidebarPreferences, b: SidebarPreferences): boolean {
  return a.brandPosition === b.brandPosition
    && a.globalNavigationPosition === b.globalNavigationPosition
    && a.toolsPosition === b.toolsPosition
}

type WidgetStatus = CompactWidgetPresentation | 'notLoaded' | 'failed' | 'pendingEnable' | 'pendingDisable'

interface CompactWidgetRow {
  id: string
  label: string
  enabled: boolean
  status: WidgetStatus
  error?: string
}

function readWidgetDraft(text: string | undefined): CompactWidgetPreference[] {
  if (text === undefined) return []
  try {
    return validateCompactWidgetPreferences(JSON.parse(text))
  } catch {
    return []
  }
}

function buildWidgetRows(
  preferences: readonly CompactWidgetPreference[],
  catalog: readonly CompactWidgetCatalogEntry[],
  applied: readonly CompactWidgetPreference[],
): CompactWidgetRow[] {
  const preferred = new Map<string, CompactWidgetPreference>()
  for (const preference of preferences) if (!preferred.has(preference.id)) preferred.set(preference.id, preference)
  const byId = new Map(catalog.map((entry) => [entry.id, entry]))
  const ordered = orderCompactWidgetEntries(catalog, preferences)
  const ids: string[] = []
  const seen = new Set<string>()
  for (const preference of preferences) {
    if (seen.has(preference.id)) continue
    seen.add(preference.id)
    ids.push(preference.id)
  }
  for (const item of ordered) {
    if (seen.has(item.entry.id)) continue
    seen.add(item.entry.id)
    ids.push(item.entry.id)
  }

  return ids.map((id) => {
    const registration = byId.get(id)
    const enabled = preferred.get(id)?.enabled ?? true
    const status: WidgetStatus = registration?.error !== undefined
      ? 'failed'
      : !registration
        ? 'notLoaded'
        : enabled !== (applied.find((item) => item.id === id)?.enabled ?? true)
          ? enabled ? 'pendingEnable' : 'pendingDisable'
          : registration.presentation
    const row: CompactWidgetRow = {
      id,
      label: registration?.label ?? id,
      enabled,
      status,
    }
    if (registration?.error !== undefined) row.error = registration.error
    return row
  })
}

function widgetStatusKey(status: WidgetStatus): MessageKey {
  switch (status) {
    case 'shown': return 'widgetShown'
    case 'enabled': return 'widgetEnabled'
    case 'clipped': return 'widgetClipped'
    case 'inactive': return 'widgetInactive'
    case 'empty': return 'widgetEmpty'
    case 'pendingEnable': return 'widgetPendingEnable'
    case 'pendingDisable': return 'widgetPendingDisable'
    case 'disabled': return 'widgetDisabled'
    case 'notLoaded': return 'widgetNotLoaded'
    case 'failed': return 'widgetFailed'
  }
}

function moveWidgetRow(rows: readonly CompactWidgetRow[], index: number, delta: -1 | 1): CompactWidgetRow[] {
  const next = [...rows]
  const target = index + delta
  if (target < 0 || target >= next.length) return next
  ;[next[index], next[target]] = [next[target]!, next[index]!]
  return next
}

const clockHourCycles = ['h23', 'h12'] as const

function ClockOptions(props: {
  t: Copy
  disabled: boolean
  display: ClockDisplay
  caption: string
  locale: LocaleSource
  onChange(next: ClockDisplay): void
}) {
  const { t, disabled, display, onChange } = props
  return h('div', { className: 'dsh-better-left-sidebar-clock-options' },
    h('div', { className: 'dsh-better-left-sidebar-clock-option-fields' },
      h(ChoiceRow, {
        name: 'dsh-better-left-sidebar-clock-hour',
        label: t('clockHourCycle'),
        value: display.hourCycle,
        disabled,
        options: clockHourCycles.map((value) => ({ value, label: t(value === 'h23' ? 'clock24' : 'clock12') })),
        onChange: (value: string) => onChange({ ...display, hourCycle: value === 'h12' ? 'h12' : 'h23' }),
      }),
      h(SettingsRow, { label: t('clockContents'), disabled },
        h('div', { className: 'dsh-better-left-sidebar-clock-modules' },
          h(Checkbox, {
            checked: display.monthDay, disabled, label: t('clockMonthDay'),
            onChange: (checked) => onChange({ ...display, monthDay: checked }),
          }),
          h(Checkbox, {
            checked: display.weekday, disabled, label: t('clockWeekday'),
            onChange: (checked) => onChange({ ...display, weekday: checked }),
          }))),
      h(ChoiceRow, {
        name: 'dsh-better-left-sidebar-clock-color-mode',
        label: t('clockColor'),
        value: display.color ? 'custom' : 'theme', disabled,
        options: [{ value: 'theme', label: t('clockColorDefault') }, { value: 'custom', label: t('clockColorCustom') }],
        onChange: (value: string) => onChange({ ...display, color: value === 'theme' ? null : '#767676' }),
      }),
      display.color ? h(SettingsRow, { label: t('clockColorCustom'), disabled },
        h('div', { className: 'dsh-better-left-sidebar-clock-color-controls' },
          h('label', { className: 'dsh-better-left-sidebar-clock-color-picker' },
            h('span', {
              className: 'dsh-better-left-sidebar-clock-color-swatch',
              style: { backgroundColor: display.color }, 'aria-hidden': 'true',
            }),
            h('input', {
              type: 'color', className: 'dsh-better-left-sidebar-clock-color-input',
              value: display.color, disabled, 'aria-label': t('clockColorCustom'),
              onChange: (event: { currentTarget: { value: string } }) => onChange({ ...display, color: event.currentTarget.value }),
            })),
          h('code', null, display.color)),
        h('p', { className: 'dsh-better-left-sidebar-clock-color-hint' }, t('clockColorHint'))) : null),
    h(ClockPreview, { display, caption: props.caption, locale: props.locale }))
}

function ClockPreview(props: { display: ClockDisplay; caption: string; locale: LocaleSource }) {
  const now = useMinuteClock(true)
  const localeId = useSyncExternalStore(
    (listener) => props.locale.subscribe(listener),
    () => props.locale.getSnapshot().active,
    () => props.locale.getSnapshot().active,
  )
  return h('figure', { className: 'dsh-better-left-sidebar-clock-preview' },
    h('figcaption', null, props.caption),
    h('div', { className: 'dsh-better-left-sidebar-clock-preview-rail' },
      h(ClockFace, { now, lines: clockLines(now, localeId, props.display), color: props.display.color })))
}

function readClockDraft(text: string | undefined): ClockDisplay {
  if (!text) return normalizeClockDisplay(undefined)
  try {
    return normalizeClockDisplay(JSON.parse(text))
  } catch {
    return normalizeClockDisplay(undefined)
  }
}

function SettingsRow(props: { label: string; disabled?: boolean; children?: React.ReactNode }) {
  return h('fieldset', { className: 'dsh-better-left-sidebar-settings-row', disabled: props.disabled },
    h('legend', null, props.label),
    h('div', { className: 'dsh-better-left-sidebar-setting-control' }, props.children))
}

function ChoiceRow(props: {
  name: string
  label: string
  value: string
  disabled: boolean
  options: readonly { value: string; label: string }[]
  onChange(value: string): void
}) {
  return h(SettingsRow, { label: props.label, disabled: props.disabled },
    h('div', { className: 'dsh-better-left-sidebar-choice-options' },
      ...props.options.map((option) => h('label', {
        key: option.value,
        className: 'dsh-better-left-sidebar-choice-option',
      },
      h('input', {
        type: 'radio',
        name: props.name,
        value: option.value,
        checked: props.value === option.value,
        onChange: () => props.onChange(option.value),
      }),
      h('span', null, option.label)))),
  )
}

function PositionSelect(props: {
  field: string
  label: string
  value: string
  disabled: boolean
  options: readonly { value: string; label: string }[]
  onChange(value: string): void
}) {
  return h('label', { className: 'dsh-better-left-sidebar-position' },
    h('span', null, props.label),
    h('select', {
      name: props.field,
      'aria-label': props.label,
      value: props.value,
      disabled: props.disabled,
      onChange: (event: React.ChangeEvent<HTMLSelectElement>) => props.onChange(event.currentTarget.value),
    },
    ...props.options.map((option) => h('option', { key: option.value, value: option.value }, option.label))),
  )
}

function LayoutPreview(props: { title: string; preferences: SidebarPreferences; t: Copy }) {
  const { preferences, t } = props
  return h('figure', { className: 'dsh-better-left-sidebar-layout-preview' },
    h('figcaption', null, props.title),
    h('div', {
      className: 'dsh-better-left-sidebar-preview-canvas',
      role: 'img',
      'aria-label': `${t('brand')}: ${brandLabel(t, preferences.brandPosition)}; ${t('globalNavigation')}: ${globalLabel(t, preferences.globalNavigationPosition)}; ${t('tools')}: ${toolsLabel(t, preferences.toolsPosition)}`,
    },
    h('div', { className: 'dsh-better-left-sidebar-preview-rail' },
      preferences.brandPosition === 'navigation-top' ? h(PreviewBlock, { kind: 'brand', label: t('previewBrand') }) : null,
      preferences.globalNavigationPosition === 'rail' ? h(PreviewBlock, { kind: 'navigation', label: t('previewNavigation') }) : null,
      preferences.toolsPosition === 'rail-bottom' ? h(PreviewBlock, { kind: 'tools', label: t('previewTools') }) : null),
    h('div', { className: 'dsh-better-left-sidebar-preview-conversation' },
      preferences.brandPosition === 'sidebar-top' ? h(PreviewBlock, { kind: 'brand', label: t('previewBrand') }) : null,
      h('div', { className: 'dsh-better-left-sidebar-preview-session' }, t('previewNewSession')),
      preferences.globalNavigationPosition === 'conversation-top' ? h(PreviewBlock, { kind: 'navigation', label: t('previewNavigation') }) : null,
      h('div', { className: 'dsh-better-left-sidebar-preview-list' }, t('previewConversations')),
      preferences.toolsPosition === 'conversation-bottom' ? h(PreviewBlock, { kind: 'tools', label: t('previewTools') }) : null),
    preferences.brandPosition === 'hidden' ? h('div', { className: 'dsh-better-left-sidebar-preview-hidden' }, `${t('previewBrand')} · ${t('hidden')}`) : null),
  )
}

function brandLabel(t: Copy, value: BrandPosition): string {
  return t(value === 'navigation-top' ? 'navigationTop' : value === 'sidebar-top' ? 'sidebarTop' : 'hidden')
}

function globalLabel(t: Copy, value: GlobalNavigationPosition): string {
  return t(value === 'rail' ? 'rail' : 'conversationTop')
}

function toolsLabel(t: Copy, value: ToolsPosition): string {
  return t(value === 'rail-bottom' ? 'railBottom' : 'conversationBottom')
}

function PreviewBlock(props: { kind: 'brand' | 'navigation' | 'tools'; label: string }) {
  return h('div', { className: `dsh-better-left-sidebar-preview-block is-${props.kind}` }, props.label)
}
