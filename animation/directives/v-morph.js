import TweenLite from 'gsap/TweenLite'
import {animate, bindAnimate, defaultConfig} from '../shared'
import {interpolatePath} from 'd3-interpolate-path'

export default {
  bind (el, binding) {
    el.setAttribute('data-vg-animated', '')
    let d = el.getAttribute('d')

    bindAnimate(el, function (options) {
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
        data: options.order,
        onStart: () => el.setAttribute('data-vg-animating', ''),
        onComplete: () => {
          el.removeAttribute('data-vg-animating')
        },
        onUpdate () {
          d = interpolator(target.t)
          el.setAttribute('d', d)
        }
      }
      return TweenLite.to(target, options.duration, vars)
    })
  },
  update (el, binding) {
    animate(el, binding.value)
  }
}
