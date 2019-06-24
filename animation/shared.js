import {interpolateTransform2} from '../helpers/Transform'

export const _ANIMATE_ = Symbol('animate')
export const _TWEEN_ = Symbol('TWEEN')

export const defaultConfig = {
  duration: 0.66667,
  ease: null,
  interpolate: {transform: interpolateTransform2}
}

export function retrieveTweens (elements) {
  const tweens = Array.prototype.map.call(elements, el => el[_TWEEN_])
    .filter(r => r != null)
    .sort((a, b) => a[0] - b[0])
    .map(r => r[1])
  return tweens
}

export function storeTween (el) {
  let tween = null
  Object.defineProperty(el, _TWEEN_, {
    get () {
      const active = tween
      tween = null
      return active
    },
    set (value) {
      tween = value
    }
  })
}
