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
    el.setAttribute('pathLength', '100')
    el.setAttribute('stroke-dasharray', '100')
    animate(el, binding)
  },
  update: animate
}

function animate (el, binding) {
  const name = binding.arg || 'default'
  const options = Object.assign({
    duration: 0.0166667,
    order: 0
  }, binding.value)
  if (typeof options.duration === 'function') {
    options.duration = options.duration(el.getTotalLength())
  }
  const tween = TweenLite.fromTo(el, options.duration,
    {attr: {'stroke-dashoffset': 100}},
    {attr: {'stroke-dashoffset': 0}, ease: Linear.easeNone}
  )
  if (name in currentAnimations) currentAnimations[name].push([options.order, tween])
}
