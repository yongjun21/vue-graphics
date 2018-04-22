import 'gsap/TweenLite'
import _debounce from 'lodash-es/debounce'

export default {
  name: 'AnimatedLine',
  props: {
    attrs: Object,
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
    animate: _debounce(function (el, done) {
      const length = el.getTotalLength()
      TweenLite.fromTo(this.$data, this.duration, {
        length: length,
        offset: length
      }, {
        offset: 0,
        ease: Linear.easeNone,
        onComplete: done
      })
    }, 100)
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
          'stroke-dashoffset': this.offset,
          'fill': 'none'
        }, this.attrs)
      })
    ])
  }
}
