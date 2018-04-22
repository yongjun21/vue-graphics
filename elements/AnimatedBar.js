import 'gsap/TweenLite'

export default {
  name: 'AnimatedBar',
  props: {
    attrs: Object,
    on: Object,
    duration: {
      type: Number,
      default: 0.2
    }
  },
  data () {
    return Object.assign({}, this.attrs)
  },
  watch: {
    attrs (attrs) {
      TweenLite.to(this.$data, this.duration, attrs)
    }
  },
  render (h) {
    return h('rect', {
      attrs: this.$data,
      on: this.on
    })
  }
}
