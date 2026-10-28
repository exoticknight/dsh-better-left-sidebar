import type { Context } from '@deepseek-ai/cordis'
import { SettingsForm, SettingsFormModel } from '@deepseek-ai/dsh-client-ui-primitives'
import type { SettingsFieldSpec, SettingsFormScope } from '@deepseek-ai/dsh-client-ui-primitives'
import type { PluginConfigViewProps } from '@deepseek-ai/dsh-client-ui-plugin-manager/client'
import type { Translate } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-ui-slots'
import { createElement as h, useCallback, useEffect, useMemo, useSyncExternalStore } from 'react'
import { DEFAULT_PREFERENCES, normalizePreferences } from '../preferences.js'
import type { BrandPosition, GlobalNavigationPosition, SidebarPreferences, ToolsPosition } from '../preferences.js'

const NS = 'dsh-better-left-sidebar'
const PACKAGE = 'dsh-better-left-sidebar'

const en = {
  summary: 'Set how navigation opens and where each built-in area lives.',
  navigationBehavior: 'Navigation behavior',
  contentLayout: 'Content layout',
  expansion: 'Expansion',
  expandNavigation: 'Expand navigation',
  closeNavigation: 'Close navigation',
  animation: 'Animation',
  hover: 'Hover to expand',
  click: 'Click to expand',
  standard: 'Soft',
  fast: 'Fast',
  off: 'Off',
  brand: 'Brand',
  globalNavigation: 'Global navigation',
  tools: 'Tools and status',
  navigationTop: 'Navigation top',
  sidebarTop: 'Conversation pane top',
  hidden: 'Hidden',
  rail: 'Navigation rail',
  conversationTop: 'Above conversations',
  railBottom: 'Navigation bottom',
  conversationBottom: 'Below conversations',
  applied: 'Applied',
  preview: 'Unsaved preview',
  previewBrand: 'Brand',
  previewNavigation: 'Nav',
  previewTools: 'Tools',
  previewNewSession: 'New session',
  previewConversations: 'Workspaces and conversations',
  resetLayout: 'Restore default layout',
  cancel: 'Discard changes',
  unavailable: 'Settings are unavailable while this component is not loaded.',
  readOnly: 'This DSH profile does not allow settings changes.',
  saveFailed: 'DSH did not accept these settings. Your draft is still here; try saving again.',
  save: 'Save settings',
  saving: 'Saving…',
}

const zh = {
  summary: '设置导航展开方式，并为各个区域选择位置。',
  navigationBehavior: '导航行为',
  contentLayout: '内容布局',
  expansion: '展开方式',
  expandNavigation: '展开导航',
  closeNavigation: '收起导航',
  animation: '动画效果',
  hover: '悬停展开',
  click: '点击展开',
  standard: '柔和',
  fast: '快速',
  off: '无动画',
  brand: '品牌区',
  globalNavigation: '全局导航',
  tools: '工具与状态',
  navigationTop: '导航栏顶部',
  sidebarTop: '对话面板顶部',
  hidden: '隐藏品牌',
  rail: '左侧导航栏',
  conversationTop: '对话列表上方',
  railBottom: '导航栏底部',
  conversationBottom: '对话列表下方',
  applied: '已生效',
  preview: '未保存预览',
  previewBrand: '品牌区',
  previewNavigation: '全局',
  previewTools: '工具',
  previewNewSession: '新建会话',
  previewConversations: '工作区与会话',
  resetLayout: '恢复默认布局',
  cancel: '放弃更改',
  unavailable: '此组件未加载时，设置不可用。',
  readOnly: '当前 DSH profile 不允许修改设置。',
  saveFailed: 'DSH 未接受这些设置。草稿仍保留，请重试保存。',
  save: '保存设置',
  saving: '保存中…',
}

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    'dsh-better-left-sidebar': keyof typeof en
  }
}

type Copy = Translate<keyof typeof en>
type ConfigValues = Record<string, unknown>
type PageProps = PluginConfigViewProps & { t: Copy }
type BoundPageProps = PageProps & { ctx: Context }
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
  {
    field: 'layoutVersion',
    format: (value: unknown) => value === 1 ? '1' : '',
    parse: (text: string) => text === '1' ? { kind: 'set' as const, value: 1 } : text === '' ? { kind: 'clear' as const } : undefined,
  },
] satisfies SettingsFieldSpec[]

function choiceField(field: string, values: readonly string[]): SettingsFieldSpec {
  return {
    field,
    format: (value) => typeof value === 'string' && values.includes(value) ? value : values[0]!,
    parse: (text) => values.includes(text) ? { kind: 'set', value: text } : undefined,
  }
}

export function connectSettings(
  ctx: Context,
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
      () => settingsCtx.locale.register(NS, { zh, en }),
      'better-left-sidebar: settings copy',
    )
    settingsCtx.effect(() => {
      const sync = (): void => onTranslate(settingsCtx.locale.bind(NS) as unknown as (key: string) => string)
      sync()
      return settingsCtx.locale.subscribe(sync)
    }, 'better-left-sidebar: toggle copy')
    settingsCtx.effect(
      () => settingsCtx.slots.inject('plugins.bundle.config', () => settingsCtx.slots.register(
        { name: 'plugins.bundle.config', key: PACKAGE, locale: NS },
        (props: PageProps) => h(SettingsPage, { ...props, ctx: settingsCtx }),
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
  const actions = useMemo(() => model.actions(), [model])
  const disabled = !view.shell.writable || view.shell.saving
  const savedSnapshot = scope.getSnapshot()
  const savedPreferences = normalizePreferences(savedSnapshot.value)
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

  if (props.view === 'summary') return h('p', null, t('summary'))

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
    children: h('div', { className: 'dsh-better-left-sidebar-preferences' },
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
      h('section', { className: 'dsh-better-left-sidebar-settings-group' },
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
        h('div', { className: 'dsh-better-left-sidebar-layout-previews', 'aria-live': 'polite' },
          view.shell.dirty
            ? h(LayoutPreview, { title: t('applied'), preferences: savedPreferences, t })
            : null,
          h(LayoutPreview, { title: view.shell.dirty ? t('preview') : t('applied'), preferences: draft, t })),
        view.shell.dirty ? h('button', {
          type: 'button',
          className: 'dsh-better-left-sidebar-layout-cancel',
          disabled: view.shell.saving,
          onClick: actions.discard,
        }, t('cancel')) : null)),
  })
}

function sameLayout(a: SidebarPreferences, b: SidebarPreferences): boolean {
  return a.brandPosition === b.brandPosition
    && a.globalNavigationPosition === b.globalNavigationPosition
    && a.toolsPosition === b.toolsPosition
}

function ChoiceRow(props: {
  name: string
  label: string
  value: string
  disabled: boolean
  options: readonly { value: string; label: string }[]
  onChange(value: string): void
}) {
  return h('fieldset', { className: 'dsh-better-left-sidebar-choice-row', disabled: props.disabled },
    h('legend', null, props.label),
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
