import responsiveMixin from '../mixins/responsiveMixin'

export default {
  name: 'ResponsiveWrapper',
  extends: responsiveMixin,
  props: {
    paddingTop: {
      type: [Number, Function],
      default: 0
    },
    paddingBottom: {
      type: [Number, Function],
      default: 0
    },
    paddingLeft: {
      type: [Number, Function],
      default: 0
    },
    paddingRight: {
      type: [Number, Function],
      default: 0
    }
  },
  computed: {
    paddingTop_ () {
      if (typeof this.paddingTop === 'function') return this.paddingTop()
      return this.paddingTop
    },
    paddingBottom_ () {
      if (typeof this.paddingBottom === 'function') return this.paddingBottom()
      return this.paddingBottom
    },
    paddingLeft_ () {
      if (typeof this.paddingLeft === 'function') return this.paddingLeft()
      return this.paddingLeft
    },
    paddingRight_ () {
      if (typeof this.paddingRight === 'function') return this.paddingRight()
      return this.paddingRight
    }
  },
  render (h) {
    return this.$scopedSlots.default({
      x: this.paddingLeft_,
      y: this.paddingTop_,
      width: this.width && (this.width - this.paddingLeft_ - this.paddingRight_),
      height: this.height && (this.height - this.paddingTop_ - this.paddingBottom_)
    })
  }
}
