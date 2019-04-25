import TweenLite from 'gsap/TweenLite'
import {_ANIMATE_, currentAnimations} from './shared'

export default function (Target, animatedProps = []) {
  if (animatedProps.length === 0) return Target

  const props = {
    animationGroup: {
      type: [String, Number, Symbol],
      default: 'default'
    },
    duration: {
      type: [Number, Function],
      default: 0.66667
    },
    order: {
      type: Number,
      default: 0
    }
  }
  const interpolatedProps = {}
  const watch = {}

  animatedProps = animatedProps.map(prop => {
    if (typeof prop === 'object') {
      if (prop.interpolate) interpolatedProps[prop.name] = prop.interpolate
      prop = prop.name
    }
    props[prop] = null
    watch[prop] = 'onUpdate'
    return prop
  })

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
        vars = Object.assign({}, vars)
        let duration = vars.duration
        const order = vars.order || 0
        delete vars.duration
        delete vars.order
        const target = this.animating
        if (typeof duration === 'function') duration = duration(vars, target)

        const interpolators = {}
        Object.keys(vars).forEach(prop => {
          if (prop in interpolatedProps) {
            interpolators[prop] = interpolatedProps[prop](target[prop], vars[prop])
            delete vars[prop]
          }
          if (!(prop in target)) delete vars[prop]
        })

        target._t = 0
        Object.assign(vars, {
          _t: 1,
          onStart: () => {
            this.class['vg-animating'] = true
          },
          onComplete: () => {
            this.class['vg-animating'] = false
            done && done()
          },
          onUpdate: () => {
            Object.keys(interpolators).forEach(prop => {
              target[prop] = interpolators[prop](target._t)
            })
          }
        })
        const tween = TweenLite[reverse ? 'from' : 'to'](target, duration, vars)
        if (this.animationGroup in currentAnimations) {
          currentAnimations[this.animationGroup].push([order, tween])
        }
      },
      onUpdate () {
        const vars = {
          duration: this.duration,
          order: this.order
        }
        animatedProps.forEach(prop => {
          vars[prop] = this[prop]
        })
        this.animate(vars)
      }
    },
    watch,
    mounted () {
      this.$el[_ANIMATE_] = this.animate.bind(this)
    },
    render (h) {
      const {animating, $attrs, $scopedSlots} = this
      const attrs = Object.assign({}, animating, $attrs)
      return h(Target, {class: this.class, attrs, scopedSlots: $scopedSlots})
    }
  }
}
