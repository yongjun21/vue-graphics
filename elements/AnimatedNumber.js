import 'gsap/TweenLite'

export default {
  name: 'AnimatedNumber',
  props: {
    value: Number,
    duration: {
      type: Number,
      default: 0.5
    },
    auto: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      display: this.value
    }
  },
  methods: {
    animate () {
      TweenLite.to(this.$data, this.duration, {display: this.value})
    }
  },
  watch: {
    value () {
      if (this.auto) this.animate()
    }
  },
  render (h) {
    return h('span', {class: 'vg-animated'}, Math.round(this.display).toLocaleString())
  }
}
