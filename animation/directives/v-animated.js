import '../../polyfills/SVGElement.prototype.classList'
import TweenLite from 'gsap/TweenLite'
import {_ANIMATE_, currentAnimations, defaultConfig} from '../shared'

export default {
  bind (el, binding) {
    el.classList.add('vg-animated')

    const target = {_t: 0}
    const vars = binding.arg ? {[binding.arg]: binding.value} : binding.value
    Object.keys(vars).forEach(prop => {
      if (prop === 'animation') return
      el.setAttribute(prop, target[prop] = vars[prop])
    })

    const group = (vars.animation && vars.animation.group) || defaultConfig.group
    el.setAttribute('data-vg-animated', group)

    el[_ANIMATE_] = function (vars, done, reverse) {
      vars = Object.assign({}, vars)
      const options = Object.assign({}, defaultConfig, vars.animation)
      delete vars.animation
      if (typeof options.duration === 'function') {
        options.duration = options.duration(vars, target)
      }

      el.setAttribute('data-vg-animated', options.group)
      Object.keys(vars).forEach(prop => {
        if (!(prop in target)) el.setAttribute(prop, target[prop] = vars[prop])
      })

      const animating = []
      const interpolators = {}
      Object.keys(vars).forEach(prop => {
        if (vars[prop] !== target[prop]) {
          animating.push(prop)
          if (options.interpolate[prop]) {
            interpolators[prop] = options.interpolate[prop](target[prop], vars[prop])
            delete vars[prop]
          }
        } else {
          delete vars[prop]
        }
      })

      if (animating.length === 0) return

      TweenLite.set(target, {_t: 0}) // force reset t
      Object.assign(vars, {
        _t: 1,
        onStart () {
          el.classList.add('vg-animating')
        },
        onComplete () {
          el.classList.remove('vg-animating')
          done && done()
        },
        onUpdate () {
          Object.keys(interpolators).forEach(prop => {
            target[prop] = interpolators[prop](target._t)
          })
          animating.forEach(prop => {
            el.setAttribute(prop, target[prop])
          })
        }
      })
      const tween = TweenLite[reverse ? 'from' : 'to'](target, options.duration, vars)
      if (options.group in currentAnimations) {
        currentAnimations[options.group].push([options.order, tween])
      }
      return tween
    }
  },
  update (el, binding) {
    el.classList.add('vg-animated')
    if (shouldNotUpdate(binding.value, binding.oldValue, binding.arg)) return
    const vars = binding.arg ? {[binding.arg]: binding.value} : binding.value
    el[_ANIMATE_](vars)
  }
}

function shouldNotUpdate (value, oldValue, direct) {
  if (direct) return value === oldValue
  return Object.keys(value)
    .every(prop => prop === 'animation' || value[prop] === oldValue[prop])
}
