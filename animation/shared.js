import {interpolateTransform2} from '../helpers/Transform'

export const _ANIMATE_ = Symbol('animate')

export const defaultConfig = {
  group: 'default',
  duration: 0.66667,
  order: 0,
  interpolate: {transform: interpolateTransform2}
}

export const currentAnimations = {}

export function queueAnimations (...names) {
  if (names.length === 0) names.push(defaultConfig.group)
  if (names.length > 0) {
    names.forEach(name => {
      currentAnimations[name] = currentAnimations[name] || []
    })
  }
}

export function flushAnimations (name = defaultConfig.group) {
  if (!(name in currentAnimations)) return []
  const queued = currentAnimations[name]
  delete currentAnimations[name]
  return queued.sort((a, b) => a[0] - b[0]).map(r => r[1])
}
