import TweenLite from 'gsap/TweenLite'
import {_ANIMATE_, _TWEEN_, storeTween, defaultConfig} from './shared'

export default function (Target, animatedProps = []) {
  if (animatedProps.length === 0) return Target

  const props = {
    animation: Object
  }
  animatedProps.forEach(prop => { props[prop] = null })

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
          onStart: () => {
            this.class['vg-animating'] = true
          },
          onComplete: () => {
            this.class['vg-animating'] = false
            this.$el[_TWEEN_] = null
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
        const tween = TweenLite[reverse ? 'from' : 'to'](target, options.duration, vars)
        this.$el[_TWEEN_] = [options.order, tween]
        return tween
      }
    },
    mounted () {
      storeTween(this.$el)
      this.$el[_ANIMATE_] = this.animate.bind(this)
      this.$watch(vm => animatedProps.map(prop => vm[prop]), () => this.animate(this.$props))
    },
    render (h) {
      const {animating, $attrs, $scopedSlots} = this
      const attrs = Object.assign({}, animating, $attrs)
      delete attrs._t
      return h(Target, {class: this.class, attrs, scopedSlots: $scopedSlots})
    }
  }
}
