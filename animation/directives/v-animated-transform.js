import '../../polyfills/SVGElement.prototype.classList'
import TweenLite from 'gsap/TweenLite'
import {_ANIMATE_} from '../shared'
import {TransformHelper} from '../../helpers'

export default {
  bind (el, binding) {
    el.classList.add('vg-animated')
    const options = binding.value instanceof TransformHelper
                  ? {transform: binding.value}
                  : binding.value
    const target = options.transform.clone()
    el.setAttribute('transform', target)

    el[_ANIMATE_] = function (binding) {
      const options = binding.value instanceof TransformHelper
                    ? {transform: binding.value}
                    : binding.value
      options.duration = options.duration || 0.66667
      if (typeof options.duration === 'function') {
        options.duration = options.duration(options.transform, target)
      }
      const vars = Object.assign({
        onStart: () => el.classList.add('vg-animating'),
        onComplete: () => el.classList.remove('vg-animating'),
        onUpdate: () => el.setAttribute('transform', target)
      }, options.transform.params)
      TweenLite.to(target.params, options.duration, vars)
    }
  },
  update (el, binding) {
    el[_ANIMATE_](binding)
  }
}
