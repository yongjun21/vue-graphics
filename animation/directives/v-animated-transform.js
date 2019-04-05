import '../../polyfills/SVGElement.prototype.classList'
import TweenLite from 'gsap/TweenLite'
import {_TRANSFORMATION_} from '../shared'

export default {
  bind (el, binding) {
    el.classList.add('vg-animated')
    const target = binding.value.transform.clone()
    el[_TRANSFORMATION_] = target
    el.setAttribute('transform', target.toString())
  },
  update (el, binding) {
    const target = el[_TRANSFORMATION_]
    const duration = binding.value.duration || 0.0166667
    const vars = Object.assign({
      onStart: () => el.classList.add('vg-animating'),
      onComplete: () => el.classList.remove('vg-animating'),
      onUpdate: () => el.setAttribute('transform', target.toString())
    }, binding.value.transform.params)
    TweenLite.to(target.params, duration, vars)
  }
}
