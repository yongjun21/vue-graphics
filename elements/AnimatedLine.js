import 'gsap/TweenLite'

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
      offset: getLength(this.d)
    }
  },
  computed: {
    length () {
      return getLength(this.d)
    }
  },
  methods: {
    animate () {
      const duration = this.speed ? this.speed * this.length : this.duration
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
      attrs: Object.assign({}, this.$attrs, {
        d: this.d,
        'stroke-dasharray': this.length,
        'stroke-dashoffset': this.offset
      }),
      on: this.$listeners
    })
  }
}

const $path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
function getLength (d) {
  $path.setAttribute('d', d)
  return Math.ceil($path.getTotalLength())
}
