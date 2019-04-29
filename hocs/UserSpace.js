import {userSpaceMixin} from '../mixins'
import {TransformHelper} from '../helpers'

export default {
  extends: userSpaceMixin,
  props: {
    layout: TransformHelper,
    originAt: {
      validator: prop => [
        'xMinYMin',
        'xMinYMid',
        'xMinYMax',
        'xMidYMin',
        'xMidYMid',
        'xMidYMax',
        'xMaxYMin',
        'xMaxYMid',
        'xMaxYMax'
      ].includes(prop),
      default: 'xMinYMin'
    }
  },
  render (h) {
    const {transform, xRange, yRange} = this
    const slots = this.$scopedSlots.default
    return h('g', {
      attrs: {transform: transform.isIdentity() ? null : transform}
    }, slots && slots({xRange, yRange, transform}))
  }
}
