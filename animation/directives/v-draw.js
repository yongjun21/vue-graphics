/* globals Linear */
import '../../polyfills/SVGElement.prototype.classList'
import TweenLite from 'gsap/TweenLite'
import {_ANIMATE_, currentAnimations, defaultConfig} from '../shared'

export default {
  bind (el, binding) {
    if (typeof el.getTotalLength !== 'function') {
      return console.warn('Using directive `v-draw` on unsupported element')
    }

    el.classList.add('vg-animated')

    el[_ANIMATE_] = function (options) {
      const totalLength = el.getTotalLength()
      el.setAttribute('stroke-dasharray', totalLength)
      el.setAttribute('stroke-dashoffset', totalLength)

      options = Object.assign({}, defaultConfig, options)
      if (typeof options.duration === 'function') {
        options.duration = options.duration(totalLength)
      }

      el.setAttribute('data-vg-animated', options.group)

      const target = {offset: totalLength}
      const vars = {
        offset: 0,
        ease: Linear.easeNone,
        onStart: () => el.classList.add('vg-animating'),
        onComplete: () => el.classList.remove('vg-animating'),
        onUpdate: () => el.setAttribute('stroke-dashoffset', target.offset)
      }
      const tween = TweenLite.to(target, options.duration, vars)
      if (options.group in currentAnimations) {
        currentAnimations[options.group].push([options.order, tween])
      }
      return tween
    }

    el[_ANIMATE_](binding.value)
  },
  update (el, binding, vnode, oldVnode) {
    el.classList.add('vg-animated')
    if (
      vnode.data.attrs.d === oldVnode.data.attrs.d &&
      el.getAttribute('stroke-dashoffset') === '0'
    ) return
    el[_ANIMATE_](binding.value)
  }
}
