import responsiveMixin from '../../mixins/responsiveMixin'

export default {
  name: 'ResponsiveWrapper',
  extends: responsiveMixin,
  render (h) {
    return this.$scopedSlots.default({
      width: this.width,
      height: this.height
    })
  }
}
