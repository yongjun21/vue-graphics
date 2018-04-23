import 'gsap/TweenLite'

export default {
  name: 'AnimatedBar',
  props: {
    x: Number,
    y: Number,
    width: Number,
    height: Number,
    duration: {
      type: Number,
      default: 0.2
    }
  },
  data () {
    return {
      props: Object.assign({}, this.$props)
    }
  },
  watch: {
    $props: {
      handler (props) {
        TweenLite.to(this.props, this.duration, props)
      },
      deep: true
    }
  },
  render (h) {
    return h('rect', {
      attrs: Object.assign({}, this.$attrs, this.props),
      on: this.$listeners
    })
  }
}
