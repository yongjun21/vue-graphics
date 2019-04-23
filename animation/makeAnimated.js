import TweenLite from 'gsap/TweenLite'
import {_ANIMATE_, currentAnimations} from './shared'

export default function (Target, animatedProps = []) {
  const props = {
    name: {
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
  const watch = {}
  animatedProps.forEach(prop => {
    props[prop] = null
    watch[prop] = 'onUpdate'
  })
  return {
    inheritAttrs: false,
    props,
    data () {
      const animating = {}
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
        Object.assign(vars, {
          onStart: () => {
            this.class['vg-animating'] = true
          },
          onComplete: () => {
            this.class['vg-animating'] = false
            done && done()
          }
        })
        const tween = TweenLite[reverse ? 'from' : 'to'](target, duration, vars)
        if (this.name in currentAnimations) currentAnimations[this.name].push([order, tween])
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
