import TweenLite from 'gsap/TweenLite'
import {animate, bindAnimate, defaultConfig} from '../shared'

export default {
  bind (el, binding) {
    el.setAttribute('data-vg-animated', '')

    const target = {_t: 0}
    const vars = binding.arg ? {[binding.arg]: binding.value} : binding.value
    Object.keys(vars).forEach(prop => {
      if (prop === 'animation') return
      el.setAttribute(prop, target[prop] = vars[prop])
    })

    bindAnimate(el, function (vars, done, reverse) {
      vars = Object.assign({}, vars)
      const options = Object.assign({}, defaultConfig, vars.animation)
      delete vars.animation
      if (typeof options.duration === 'function') {
        options.duration = options.duration(vars, target)
      }

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
        data: options.order,
        onStart () {
          el.setAttribute('data-vg-animating', '')
        },
        onComplete () {
          el.removeAttribute('data-vg-animating')
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
      return TweenLite[reverse ? 'from' : 'to'](target, options.duration, vars)
    })
  },
  update (el, binding) {
    if (shouldNotUpdate(binding.value, binding.oldValue, binding.arg)) return
    const vars = binding.arg ? {[binding.arg]: binding.value} : binding.value
    animate(el, vars)
  }
}

function shouldNotUpdate (value, oldValue, direct) {
  if (direct) return value === oldValue
  return Object.keys(value)
    .every(prop => prop === 'animation' || value[prop] === oldValue[prop])
}
