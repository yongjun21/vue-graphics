import TweenLite from 'gsap/TweenLite'
import {currentAnimations} from './shared'

export default function (Target) {
  return {
    inheritAttrs: false,
    props: {
      name: {
        type: [String, Number, Symbol],
        default: 'default'
      },
      animated: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        keys: [],
        class: {
          'vg-animated': true,
          'vg-animating': false
        },
        animating: {}
      }
    },
    methods: {
      animate () {
        const vars = Object.assign({}, this.animated)
        let duration = vars.duration || 0.66667
        const order = vars.order || 0
        delete vars.duration
        delete vars.order
        const target = this.animating
        if (typeof duration === 'function') duration = duration(vars, target)
        Object.keys(vars).forEach(prop => {
          if (!(prop in target)) {
            this.keys.push(prop)
            this.$set(target, prop, vars[prop])
          }
          if (vars[prop] === target[prop]) delete vars[prop]
        })
        if (Object.keys(vars).length === 0) return
        Object.assign(vars, {
          onStart: () => { this.class['vg-animating'] = true },
          onComplete: () => { this.class['vg-animating'] = false }
        })
        const tween = TweenLite.to(target, duration, vars)
        if (this.name in currentAnimations) currentAnimations[this.name].push([order, tween])
      }
    },
    watch: {
      animated: {
        handler: 'animate',
        immediate: true
      }
    },
    render (h) {
      const {animating, $attrs, $scopedSlots} = this
      const attrs = {}
      this.keys.forEach(prop => {
        attrs[prop] = animating[prop]
      })
      Object.assign(attrs, $attrs)
      return h(Target, {class: this.class, attrs, scopedSlots: $scopedSlots})
    }
  }
}
