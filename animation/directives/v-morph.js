import '../../polyfills/SVGElement.prototype.classList'
import TweenLite from 'gsap/TweenLite'
import {_ANIMATE_, currentAnimations, defaultConfig} from '../shared'
import {interpolatePath} from 'd3-interpolate-path'

export default {
  bind (el, binding) {
    let d = el.getAttribute('d')

    el.classList.add('vg-animated')

    el[_ANIMATE_] = function (options) {
      const updated = el.getAttribute('d')
      el.setAttribute('d', d)

      options = Object.assign({}, defaultConfig, options)
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
    }
  },
  update (el, binding) {
    el[_ANIMATE_](binding.value)
  }
}
