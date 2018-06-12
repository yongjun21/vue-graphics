import 'gsap/TweenLite'

import {createSVGElement} from '../util'

export default {
  name: 'AnimatedLine',
  props: {
    d: String,
    speed: Number,
    duration: {
      type: Number,
      default: 0.5
    },
    debounce: {
      type: Number,
      default: 0
    },
    auto: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      offset: getPathLength(this.d)
    }
  },
  computed: {
    length () {
      return getPathLength(this.d)
    }
  },
  methods: {
    animate () {
      const duration = this.speed ? this.length / this.speed : this.duration
      return TweenLite.to(this.$data, duration, {
        offset: 0,
        ease: Linear.easeNone,
        delay: this.debounce,
        overwrite: 'all'
      })
    }
  },
  watch: {
    d () {
      this.offset = this.length
      if (this.auto) this.animate()
    }
  },
  mounted () {
    if (this.auto) this.animate()
  },
  render (h) {
    return h('path', {
      attrs: {
        d: this.d,
        'fill': 'none',
        'stroke-dasharray': this.length,
        'stroke-dashoffset': this.offset
      },
      on: this.$listeners
    })
  }
}

let $path
function getPathLength (d) {
  $path = $path || createSVGElement('path')
  $path.setAttribute('d', d)
  return Math.ceil($path.getTotalLength())
}
