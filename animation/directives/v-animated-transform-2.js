import '../../polyfills/SVGElement.prototype.classList'
import TweenLite from 'gsap/TweenLite'
import {_ANIMATE_} from '../shared'
import {TransformHelper} from '../../helpers'

export default {
  bind (el, binding) {
    el.classList.add('vg-animated')
    const target = binding.value instanceof TransformHelper
                 ? binding.value.decompose()
                 : binding.value.transform.decompose()
    el.setAttribute('transform', TransformHelper.recompose(target))

    el[_ANIMATE_] = function (options) {
      options = options instanceof TransformHelper
              ? {transform: options}
              : options
      options.duration = options.duration || 0.66667
      if (typeof options.duration === 'function') {
        options.duration = options.duration(options.transform, TransformHelper.recompose(target))
      }
      const vars = Object.assign({
        onStart: () => el.classList.add('vg-animating'),
        onComplete: () => el.classList.remove('vg-animating'),
        onUpdate: () => el.setAttribute('transform', TransformHelper.recompose(target))
      }, options.transform.decompose())
      if (vars.rotate - target.rotate > 180) target.rotate += 360
      else if (vars.rotate - target.rotate < -180) target.rotate -= 360
      TweenLite.to(target, options.duration, vars)
    }
  },
  update (el, binding) {
    el[_ANIMATE_](binding.value)
  }
}
