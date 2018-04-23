import 'gsap/TweenLite'
import _debounce from 'lodash-es/debounce'

export default {
  name: 'AnimatedLine',
  props: {
    attrs: Object,
    on: Object,
    speed: Number,
    duration: {
      type: Number,
      default: 0.5
    },
    debounce: Number
  },
  data () {
    return {
      length: null,
      offset: null
    }
  },
  methods: {
    animate (el, done) {
      const length = el.getTotalLength()
      const duration = this.speed ? this.speed * length : this.duration
      TweenLite.fromTo(this.$data, duration, {
        length: length,
        offset: length
      }, {
        offset: 0,
        ease: Linear.easeNone,
        onComplete: done
      })
    }
  },
  created () {
    if (this.debounce != null) {
      this.$options.methods.animate = _debounce(this.$options.methods.animate, this.debounce)
    }
  },
  render (h) {
    return h('transition', {
      on: {
        beforeEnter: () => {
          this.length = 999999
          this.offset = 999999
        },
        enter: this.animate
      }
    }, [
      h('path', {
        key: this.attrs.d,
        attrs: Object.assign({
          'stroke-dasharray': this.length,
          'stroke-dashoffset': this.offset
        }, this.attrs),
        on: this.on
      })
    ])
  }
}
