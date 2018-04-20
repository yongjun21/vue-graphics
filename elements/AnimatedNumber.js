import 'gsap/TweenLite'

export default {
  name: 'AnimatedNumber',
  props: {
    value: Number,
    duration: {
      type: Number,
      default: 0.2
    }
  },
  data () {
    return {
      display: this.value
    }
  },
  watch: {
    value (v) {
      TweenLite.to(this.$data, this.duration, {display: v})
    }
  },
  render (h) {
    return h('span', Math.round(this.display).toLocaleString())
  }
}
