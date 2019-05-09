import TweenLite from 'gsap/TweenLite'
import {_ANIMATE_, currentAnimations, defaultConfig} from './shared'

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
        let destroyCalled = false
        const _destroy = this.$destroy
        this.$destroy = () => { destroyCalled = true }

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

        if (!animating) {
          if (destroyCalled) _destroy.call(this)
          else this.$destroy = _destroy
          return
        }

        if (Object.keys(interpolators).length > 0) TweenLite.to(target, 0, {_t: 0}) // force reset t
        Object.assign(vars, {
          _t: 1,
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
        const tween = TweenLite[reverse ? 'from' : 'to'](target, options.duration, vars)
        if (options.group in currentAnimations) {
          currentAnimations[options.group].push([options.order, tween])
        }
      }
    },
    mounted () {
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
