/* globals Linear */
import '../../polyfills/SVGElement.prototype.classList'
import TweenLite from 'gsap/TweenLite'
import 'gsap/AttrPlugin'
import {currentAnimations} from '../shared'

export default {
  bind (el, binding) {
    if (typeof el.getTotalLength !== 'function') {
      console.warn('Using directive `v-draw` on unsupported element')
      return
    }
    el.classList.add('vg-animated')
    animate(el, binding)
  },
  update: animate
}

function animate (el, binding, vnode, oldVnode) {
  if (oldVnode &&
      vnode.data.attrs.d === oldVnode.data.attrs.d &&
      el.getAttribute('stroke-dashoffset') === '0'
  ) return
  const name = binding.arg || 'default'
  const options = Object.assign({
    duration: 0.66667,
    order: 0
  }, binding.value)
  const totalLength = el.getTotalLength()
  if (typeof options.duration === 'function') {
    options.duration = options.duration(totalLength)
  }
  const attr = {
    'stroke-dasharray': totalLength,
    'stroke-dashoffset': totalLength
  }
  const vars = {
    attr: {'stroke-dashoffset': 0},
    ease: Linear.easeNone,
    onStart: () => el.classList.add('vg-animating'),
    onComplete: () => el.classList.remove('vg-animating')
  }
  const tween = TweenLite.fromTo(el, options.duration, {attr}, vars)
  if (name in currentAnimations) currentAnimations[name].push([options.order, tween])
}
