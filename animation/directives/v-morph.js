import '../../polyfills/SVGElement.prototype.classList'
import TweenLite from 'gsap/TweenLite'
import {_ANIMATE_, currentAnimations, defaultConfig} from '../shared'
import {interpolatePath} from 'd3-interpolate-path'

export default {
  bind (el, binding) {
    el.classList.add('vg-animated')
    let d = el.getAttribute('d')
    const group = (binding.value && binding.value.group) || defaultConfig.group

    el[_ANIMATE_] = function (options) {
      const updated = el.getAttribute('d')
      if (d === updated) return
      el.setAttribute('d', d)

      options = Object.assign({}, defaultConfig, options)
      if (options.group !== group) return
      if (typeof options.duration === 'function') {
        options.duration = options.duration(updated, d)
      }

      const target = {t: 0}
      const interpolator = interpolatePath(d, updated)
      const vars = {
        t: 1,
        onStart: () => el.classList.add('vg-animating'),
        onComplete: () => el.classList.remove('vg-animating'),
        onUpdate: () => {
          d = interpolator(target.t)
          el.setAttribute('d', d)
        }
      }
      const tween = TweenLite.to(target, options.duration, vars)
      if (options.group in currentAnimations) {
        currentAnimations[options.group].push([options.order, tween])
      }
      return tween
    }
  },
  update (el, binding) {
    el.classList.add('vg-animated')
    el[_ANIMATE_](binding.value)
  }
}
