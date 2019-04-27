import '../../polyfills/SVGElement.prototype.classList'
import TweenLite from 'gsap/TweenLite'
import {_ANIMATE_} from '../shared'
import TransformHelper, {interpolateTransform2} from '../../helpers/Transform'

export default {
  bind (el, binding) {
    el.classList.add('vg-animated')
    let transform = binding.value instanceof TransformHelper
                  ? binding.value
                  : binding.value.transform
    el.setAttribute('transform', transform)

    el[_ANIMATE_] = function (options) {
      options = options instanceof TransformHelper
              ? {transform: options}
              : options
      options.duration = options.duration || 0.66667
      if (typeof options.duration === 'function') {
        options.duration = options.duration(options.transform, transform)
      }
      const target = {t: 0}
      const interpolator = interpolateTransform2(transform, options.transform)
      const vars = {
        t: 1,
        onStart: () => el.classList.add('vg-animating'),
        onComplete: () => el.classList.remove('vg-animating'),
        onUpdate: () => {
          transform = interpolator(target.t)
          el.setAttribute('transform', transform)
        }
      }
      TweenLite.to(target, options.duration, vars)
    }
  },
  update (el, binding) {
    el[_ANIMATE_](binding.value)
  }
}
