import responsiveMixin from '../mixins/responsiveMixin'

export default {
  name: 'ResponsiveWrapper',
  extends: responsiveMixin,
  props: {
    paddingTop: {
      type: Number,
      default: 0
    },
    paddingBottom: {
      type: Number,
      default: 0
    },
    paddingLeft: {
      type: Number,
      default: 0
    },
    paddingRight: {
      type: Number,
      default: 0
    }
  },
  render (h) {
    return this.$scopedSlots.default({
      x: this.paddingLeft,
      y: this.paddingTop,
      width: this.width && (this.width - this.paddingLeft - this.paddingRight),
      height: this.height && (this.height - this.paddingTop - this.paddingBottom)
    })
  }
}
