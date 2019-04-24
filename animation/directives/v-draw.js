/* globals Linear */
import '../../polyfills/SVGElement.prototype.classList'
import TweenLite from 'gsap/TweenLite'
import {_ANIMATE_, currentAnimations} from '../shared'

export default {
  bind (el, binding) {
    if (typeof el.getTotalLength !== 'function') {
      console.warn('Using directive `v-draw` on unsupported element')
      return
    }

    const name = binding.arg || 'default'
    const target = {}

    el.classList.add('vg-animated')

    el[_ANIMATE_] = function (options) {
      const totalLength = el.getTotalLength()
      el.setAttribute('stroke-dasharray', totalLength)
      el.setAttribute('stroke-dashoffset', totalLength)

      options = Object.assign({
        duration: 0.66667,
        order: 0
      }, options)
      if (typeof options.duration === 'function') {
        options.duration = options.duration(totalLength)
      }

      const vars = {
        offset: 0,
        ease: Linear.easeNone,
        onStart: () => el.classList.add('vg-animating'),
        onComplete: () => el.classList.remove('vg-animating'),
        onUpdate: () => el.setAttribute('stroke-dashoffset', target.offset)
      }
      const tween = TweenLite.fromTo(target, options.duration, {offset: totalLength}, vars)
      if (name in currentAnimations) currentAnimations[name].push([options.order, tween])
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
