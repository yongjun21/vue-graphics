import Vue from 'vue'
import TweenLite from 'gsap/TweenLite'
import {bindAnimate, defaultConfig} from './shared'

export default function (Target, animatedProps = []) {
  if (animatedProps.length === 0) return Target

  const props = {
    animation: Object
  }
  animatedProps.forEach(prop => { props[prop] = null })

  const isNative = typeof Target === 'string' && Vue.config.isReservedTag(Target)

  return {
    inheritAttrs: false,
    props,
    data () {
      const animating = {_t: 0}
      animatedProps.forEach(prop => {
        animating[prop] = this[prop]
      })
      return {
        class: {
          'vg-animated': true,
          'vg-animating': false
        },
        animating
      }
    },
    methods: {
      animate (vars, done, reverse) {
        const target = this.animating
        vars = Object.assign({}, vars)
        const options = Object.assign({}, defaultConfig, vars.animation)
        delete vars.animation
        if (typeof options.duration === 'function') {
          options.duration = options.duration(vars, target)
        }

        let animating = false
        const interpolators = {}
        Object.keys(vars).forEach(prop => {
          if (vars[prop] !== target[prop]) {
            animating = true
            if (options.interpolate[prop]) {
              interpolators[prop] = options.interpolate[prop](target[prop], vars[prop])
              delete vars[prop]
            }
          } else {
            delete vars[prop]
          }
        })

        if (!animating) return

        let destroyCalled = false
        const _destroy = this.$destroy
        this.$destroy = () => { destroyCalled = true }

        TweenLite.set(target, {_t: 0}) // force reset t
        Object.assign(vars, {
          _t: 1,
          data: options.order,
          onStart: () => {
            this.class['vg-animating'] = true
          },
          onComplete: () => {
            this.class['vg-animating'] = false
            if (destroyCalled) _destroy.call(this)
            else this.$destroy = _destroy
            done && done()
          },
          onUpdate: () => {
            Object.keys(interpolators).forEach(prop => {
              target[prop] = interpolators[prop](target._t)
            })
          }
        })
        return TweenLite[reverse ? 'from' : 'to'](target, options.duration, vars)
      }
    },
    mounted () {
      bindAnimate(this.$el, this.animate)
      this.$watch(vm => animatedProps.map(prop => vm[prop]), () => this.animate(this.$props))
    },
    render (h) {
      const {animating, $attrs, $listeners, $scopedSlots} = this
      const attrs = Object.assign({}, animating, $attrs)
      delete attrs._t
      return h(Target, {class: this.class, attrs, on: $listeners, scopedSlots: $scopedSlots}, isNative && $scopedSlots.default && $scopedSlots.default())
    }
  }
}
