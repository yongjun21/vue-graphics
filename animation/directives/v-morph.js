import '../../polyfills/SVGElement.prototype.classList'
import TweenLite from 'gsap/TweenLite'
import {_ANIMATE_, _TWEEN_, storeTween, defaultConfig} from '../shared'
import {interpolatePath} from 'd3-interpolate-path'

export default {
  bind (el, binding) {
    el.setAttribute('data-vg-animated', '')
    storeTween(el)
    let d = el.getAttribute('d')

    el[_ANIMATE_] = function (options) {
      const updated = el.getAttribute('d')
      if (d === updated) return
      el.setAttribute('d', d)

      options = Object.assign({}, defaultConfig, options)
      if (typeof options.duration === 'function') {
        options.duration = options.duration(updated, d)
      }

      const target = {t: 0}
      const interpolator = interpolatePath(d, updated)
      const vars = {
        t: 1,
        onStart: () => el.setAttribute('data-vg-animating', ''),
        onComplete: () => {
          el.removeAttribute('data-vg-animating')
          el[_TWEEN_] = null
        },
        onUpdate () {
          d = interpolator(target.t)
          el.setAttribute('d', d)
        }
      }
      const tween = TweenLite.to(target, options.duration, vars)
      el[_TWEEN_] = [options.order, tween]
      return tween
    }
  },
  update (el, binding) {
    el[_ANIMATE_](binding.value)
  }
}
