/* globals Linear */
import '../../polyfills/SVGElement.prototype.classList'
import TweenLite from 'gsap/TweenLite'
import {_ANIMATE_, _TWEEN_, storeTween, defaultConfig} from '../shared'

export default {
  bind (el, binding) {
    if (typeof el.getTotalLength !== 'function') {
      return console.warn('Using directive `v-draw` on unsupported element')
    }

    el.setAttribute('data-vg-animated', '')
    storeTween(el)

    el[_ANIMATE_] = function (options) {
      const totalLength = el.getTotalLength()
      el.setAttribute('stroke-dasharray', totalLength)
      el.setAttribute('stroke-dashoffset', totalLength)

      options = Object.assign({}, defaultConfig, options)
      if (typeof options.duration === 'function') {
        options.duration = options.duration(totalLength)
      }

      const target = {offset: totalLength}
      const vars = {
        offset: 0,
        ease: Linear.easeNone,
        onStart: () => el.setAttribute('data-vg-animating', ''),
        onComplete: () => {
          el.removeAttribute('data-vg-animating')
          el[_TWEEN_] = null
        },
        onUpdate: () => el.setAttribute('stroke-dashoffset', target.offset)
      }
      const tween = TweenLite.to(target, options.duration, vars)
      el[_TWEEN_] = [options.order, tween]
      return tween
    }

    el[_ANIMATE_](binding.value)
  },
  update (el, binding, vnode, oldVnode) {
    if (
      vnode.data.attrs.d === oldVnode.data.attrs.d &&
      el.getAttribute('stroke-dashoffset') === '0'
    ) return
    el[_ANIMATE_](binding.value)
  }
}
