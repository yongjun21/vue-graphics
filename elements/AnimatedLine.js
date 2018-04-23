import 'gsap/TweenLite'
import _debounce from 'lodash-es/debounce'

export default {
  name: 'AnimatedLine',
  props: {
    d: String,
    debounce: Number,
    speed: Number,
    duration: {
      type: Number,
      default: 0.5
    }
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
      this.animate = _debounce(this.animate, this.debounce).bind(this)
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
        key: this.d,
        attrs: Object.assign({}, this.$attrs, {
          d: this.d,
          'stroke-dasharray': this.length,
          'stroke-dashoffset': this.offset
        }),
        on: this.$listeners
      })
    ])
  }
}
