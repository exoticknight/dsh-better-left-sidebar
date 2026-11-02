import assert from 'node:assert/strict'
import test from 'node:test'
import { connectNativeFooterState } from '../src/client/native-footer-state.ts'

function owner(component) {
  return { children: { 'sidebar.footer.action': {} }, component, options: {} }
}

function registry(initial) {
  let entries = initial
  let refresh
  let cleanup
  let registrations = 0
  const ctx = { slots: {
    inject: (_key, callback) => { cleanup = callback(); return () => cleanup() },
    entries: () => entries,
    subscribe: (_key, listener) => { refresh = listener; return () => {} },
    register: () => { registrations++; return () => {} },
  } }
  const adapter = connectNativeFooterState(ctx)
  return {
    adapter,
    get registrations() { return registrations },
    replace(next) { entries = next; refresh() },
  }
}

test('removed sidebar owners are restored and forgotten before adapter disposal', () => {
  function First() {}
  function Second() {}
  const first = owner(First)
  const second = owner(Second)
  const state = registry([first])
  const firstWrapper = first.component
  assert.notEqual(firstWrapper, First)
  state.replace([first])
  assert.equal(first.component, firstWrapper, 'live owner keeps its wrapper and component state')
  assert.equal(state.registrations, 1, 'unchanged entries do not invalidate the renderer')
  state.replace([second])
  assert.equal(first.component, First, 'removed owner is restored immediately')
  assert.notEqual(second.component, Second)
  const secondWrapper = second.component
  state.replace([])
  assert.equal(second.component, Second)
  state.replace([first])
  assert.notEqual(first.component, First, 'a returning entry must be wrapped again')
  assert.notEqual(first.component, firstWrapper, 'returning entry gets a fresh record')
  // A forgotten entry must no longer be touched by the adapter's final teardown.
  second.component = secondWrapper
  state.adapter.dispose()
  assert.equal(first.component, First)
  assert.equal(second.component, secondWrapper)
})

test('pruning and teardown never overwrite another decorator', () => {
  function Original() {}
  function ForeignWrapper() {}
  const entry = owner(Original)
  const state = registry([entry])
  entry.component = ForeignWrapper
  state.replace([])
  assert.equal(entry.component, ForeignWrapper)
  state.replace([entry])
  assert.notEqual(entry.component, ForeignWrapper)
  state.adapter.dispose()
  assert.equal(entry.component, ForeignWrapper)
})
