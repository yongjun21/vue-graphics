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
    },
    auto: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      props: {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height
      }
    }
  },
  methods: {
    animate () {
      return TweenLite.to(this.props, this.duration, {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height
      })
    }
  },
  watch: {
    $props: {
      handler () {
        if (this.auto) this.animate()
      },
      deep: true
    }
  },
  render (h) {
    return h('rect', {
      class: 'vg-bar vg-animated',
      attrs: this.props,
      on: this.$listeners
    })
  }
}
