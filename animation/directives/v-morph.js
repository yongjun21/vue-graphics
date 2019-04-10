import '../../polyfills/SVGElement.prototype.classList'
import TweenLite from 'gsap/TweenLite'
import {currentAnimations, _MORPH_STATE_} from '../shared'
import {interpolatePath} from 'd3-interpolate-path'

export default {
  bind (el, binding) {
    el.classList.add('vg-animated')
    el[_MORPH_STATE_] = {d: el.getAttribute('d')}
  },
  update: animate
}

function animate (el, binding) {
  const name = binding.arg || 'default'
  const options = Object.assign({
    duration: 0.66667,
    order: 0
  }, binding.value)

  const target = el[_MORPH_STATE_]
  const updated = el.getAttribute('d')
  const interpolator = interpolatePath(target.d, updated)
  el.setAttribute('d', target.d)

  if (typeof options.duration === 'function') {
    options.duration = options.duration(updated, target.d)
  }
  const vars = {
    t: 1,
    onStart: () => el.classList.add('vg-animating'),
    onComplete: () => el.classList.remove('vg-animating'),
    onUpdate: () => {
      target.d = interpolator(target.t)
      el.setAttribute('d', target.d)
    }
  }
  const tween = TweenLite.fromTo(target, options.duration, {t: 0}, vars)
  if (name in currentAnimations) currentAnimations[name].push([options.order, tween])
}
