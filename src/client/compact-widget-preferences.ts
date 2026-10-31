export interface CompactWidgetPreference {
  id: string
  enabled: boolean
}

export interface CompactWidgetRegistration {
  id: string
  order?: number
}

export interface OrderedCompactWidget<T extends CompactWidgetRegistration> {
  entry: T
  enabled: boolean
  saved: boolean
}

/** Keep arbitrary saved ids so registrations can disappear and return later. */
export function validateCompactWidgetPreferences(value: unknown): CompactWidgetPreference[] {
  if (!Array.isArray(value)) return []
  const result: CompactWidgetPreference[] = []
  for (const item of value) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) continue
    const record = item as Record<string, unknown>
    if (typeof record.id !== 'string') continue
    result.push({
      id: record.id,
      enabled: typeof record.enabled === 'boolean' ? record.enabled : true,
    })
  }
  return result
}

/** Saved ids lead in saved order; new registrations follow in slot order. */
export function orderCompactWidgetEntries<T extends CompactWidgetRegistration>(
  entries: readonly T[],
  preferences: readonly CompactWidgetPreference[],
): OrderedCompactWidget<T>[] {
  const savedById = new Map<string, { index: number; enabled: boolean }>()
  preferences.forEach((preference, index) => {
    if (!savedById.has(preference.id)) savedById.set(preference.id, { index, enabled: preference.enabled })
  })

  return entries
    .map((entry, registrationIndex) => ({
      entry,
      registrationIndex,
      saved: savedById.get(entry.id),
    }))
    .sort((a, b) => {
      if (a.saved && b.saved) return a.saved.index - b.saved.index || a.registrationIndex - b.registrationIndex
      if (a.saved) return -1
      if (b.saved) return 1
      const orderA = typeof a.entry.order === 'number' && Number.isFinite(a.entry.order) ? a.entry.order : 0
      const orderB = typeof b.entry.order === 'number' && Number.isFinite(b.entry.order) ? b.entry.order : 0
      return orderA - orderB || a.registrationIndex - b.registrationIndex
    })
    .map(({ entry, saved }) => ({
      entry,
      enabled: saved?.enabled ?? true,
      saved: saved !== undefined,
    }))
}
