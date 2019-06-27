/* globals Linear */
import '../../polyfills/SVGElement.prototype.classList'
import TweenLite from 'gsap/TweenLite'
import {animate, bindAnimate, defaultConfig} from '../shared'

export default {
  bind (el, binding) {
    if (typeof el.getTotalLength !== 'function') {
      return console.warn('Using directive `v-draw` on unsupported element')
    }

    el.setAttribute('data-vg-animated', '')

    bindAnimate(el, function (options) {
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
        data: options.order,
        ease: Linear.easeNone,
        onStart: () => el.setAttribute('data-vg-animating', ''),
        onComplete: () => {
          el.removeAttribute('data-vg-animating')
        },
        onUpdate: () => el.setAttribute('stroke-dashoffset', target.offset)
      }
      return TweenLite.to(target, options.duration, vars)
    })

    animate(el, binding.value)
  },
  update (el, binding, vnode, oldVnode) {
    if (
      vnode.data.attrs.d === oldVnode.data.attrs.d &&
      el.getAttribute('stroke-dashoffset') === '0'
    ) return
    animate(el, binding.value)
  }
}
