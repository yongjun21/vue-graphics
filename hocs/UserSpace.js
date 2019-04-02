import {userSpaceMixin} from '../mixins'
import {TransformHelper} from '../helpers'

export default {
  extends: userSpaceMixin,
  props: {
    xRange: {
      type: Array,
      required: true
    },
    yRange: {
      type: Array,
      required: true
    },
    layout: TransformHelper
  },
  render (h) {
    const {transform, xScale, yScale} = this
    const slots = this.$scopedSlots.default
    return h('g', {
      attrs: {transform: transform.isIdentity() ? null : transform.toString()}
    }, slots && slots({xScale, yScale}))
  }
}
