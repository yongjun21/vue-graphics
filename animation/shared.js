import {interpolateTransform2} from '../helpers/Transform'

const _ANIMATE_ = Symbol('animate')
const _TWEEN_ = Symbol('tween')

export const defaultConfig = {
  duration: 0.66667,
  ease: null,
  interpolate: {transform: interpolateTransform2}
}

export function animate (el, ...args) {
  if (!el[_ANIMATE_]) return null
  const tween = el[_ANIMATE_](...args)
  if (!tween) return null
  el[_TWEEN_] = tween
  const onComplete = tween.vars.onComplete
  if (onComplete) {
    tween.vars.onComplete = function () {
      onComplete.apply(this, arguments)
      el[_TWEEN_] = null
    }
  }
  return tween
}

export function bindAnimate (el, animate) {
  el[_ANIMATE_] = animate
  return el
}

export function retrieveTweens (elements) {
  const tweens = []
  Array.prototype.map.call(elements, el => {
    if (el[_TWEEN_]) {
      tweens.push(el[_TWEEN_])
      el[_TWEEN_] = null
    }
  })
  return tweens.sort((a, b) => a.data - b.data)
}
