import assert from 'node:assert/strict'
import test from 'node:test'
import { getNavigationToggleReserve, isHoverPointer, shouldShowNavigationToggle } from '../src/client/pointer-intent.ts'

test('touch pointers never drive the hover expansion path', () => {
  assert.equal(isHoverPointer('touch', true), false)
  assert.equal(isHoverPointer('mouse', true), true)
  assert.equal(isHoverPointer('pen', true), true)
  assert.equal(isHoverPointer('mouse', false), false)
})

test('coarse-pointer and no-hover devices get an explicit toggle with hover preference', () => {
  assert.equal(shouldShowNavigationToggle('hover', true, true), true)
  assert.equal(shouldShowNavigationToggle('hover', false, false), true)
  assert.equal(shouldShowNavigationToggle('hover', false, true), false)
  assert.equal(shouldShowNavigationToggle('click', false, true), true)
})

test('the layout reserves the navigation toggle row whenever that toggle is shown', () => {
  assert.equal(getNavigationToggleReserve('hover', true, false), 44)
  assert.equal(getNavigationToggleReserve('hover', false, true), 0)
  assert.equal(getNavigationToggleReserve('click', false, true), 44)
})
