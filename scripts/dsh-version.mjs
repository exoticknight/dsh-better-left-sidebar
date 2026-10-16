import semver from 'semver'
import { createInterface } from 'node:readline/promises'

// The 0.2 release line currently starts at this published prerelease.
// Keep the fallback reproducible; do not resolve a moving dist-tag during init.
export const DEFAULT_DSH_VERSION = '0.2.0-rc.2'

export function exactDshVersion(input) {
  const value = input.trim() === '0.2' ? DEFAULT_DSH_VERSION : input.trim()
  if (!semver.valid(value) || value !== semver.valid(value))
    throw new Error(`Invalid DSH version "${input}". Use 0.2 or an exact version, e.g. ${DEFAULT_DSH_VERSION}.`)
  return value
}

export async function chooseDshVersion(value, {
  interactive = Boolean(process.stdin.isTTY && process.stdout.isTTY),
  ask = async () => {
    const terminal = createInterface({ input: process.stdin, output: process.stdout })
    try {
      return await new Promise((resolve, reject) => {
        terminal.once('close', () => resolve(''))
        terminal.question(`Target DSH version [0.2 = ${DEFAULT_DSH_VERSION}]: `)
          .then(resolve, reject)
      })
    } finally {
      terminal.close()
    }
  },
} = {}) {
  if (value !== undefined) return exactDshVersion(value)
  if (interactive) {
    let answer
    try { answer = await ask() } catch { return DEFAULT_DSH_VERSION }
    if (answer?.trim()) return exactDshVersion(answer)
  }
  return DEFAULT_DSH_VERSION
}

export function dshCompatibility(target, minimum = target) {
  target = exactDshVersion(target)
  minimum = exactDshVersion(minimum)
  if (semver.gt(minimum, target))
    throw new Error(`Minimum DSH ${minimum} exceeds target ${target}.`)
  return minimum === target ? target : `>=${minimum} <=${target}`
}
