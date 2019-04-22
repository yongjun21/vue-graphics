import '../../polyfills/SVGElement.prototype.classList'
import TweenLite from 'gsap/TweenLite'
import {_ANIMATE_, currentAnimations} from '../shared'

export default {
  bind (el, binding) {
    const name = binding.arg || 'default'
    const target = Object.create(null)

    const vars = Object.assign({}, binding.value)
    delete vars.duration
    delete vars.order
    Object.keys(vars).forEach(prop => {
      addProperty(target, vars, prop)
      el.setAttribute(prop, target[prop])
    })

    el.classList.add('vg-animated')

    el[_ANIMATE_] = function (binding, done, reverse) {
      const vars = Object.assign({}, binding.value)
      let duration = vars.duration || 0.66667
      const order = vars.order || 0
      delete vars.duration
      delete vars.order
      if (typeof duration === 'function') duration = duration(vars, target)
      Object.keys(vars).forEach(prop => {
        if (typeof vars[prop] === 'function' || !(prop in target)) {
          addProperty(target, vars, prop)
          el.setAttribute(prop, target[prop])
        }
      })

      const animating = []
      Object.keys(vars).forEach(prop => {
        if (typeof vars[prop] === 'function') {
          animating.push(prop)
          delete vars[prop]
        } else if (vars[prop] !== target[prop]) {
          animating.push(prop)
        } else {
          delete vars[prop]
        }
      })

      if (Object.keys(vars).length === 0) return

      Object.assign(vars, {
        onStart () {
          el.classList.add('vg-animating')
        },
        onComplete () {
          el.classList.remove('vg-animating')
          done && done()
        },
        onUpdate () {
          animating.forEach(prop => {
            el.setAttribute(prop, target[prop])
          })
        }
      })
      const tween = TweenLite[reverse ? 'from' : 'to'](target, duration, vars)
      if (name in currentAnimations) currentAnimations[name].push([order, tween])
    }
  },
  update (el, binding) {
    el[_ANIMATE_](binding)
  }
}

function addProperty (target, vars, prop) {
  if (typeof vars[prop] === 'function') {
    Object.defineProperty(target, prop, {
      configurable: true,
      enumerable: true,
      get: vars[prop]
    })
  } else {
    target[prop] = vars[prop]
  }
}
