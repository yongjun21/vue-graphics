import Arc from '../elements/Arc'
import {mergeData} from '../util'

export default {
  name: 'RGridlines',
  functional: true,
  props: {
    interval: {
      type: Function,
      required: true
    },
    aScale: {
      type: Function,
      required: true
    },
    rScale: {
      type: Function,
      required: true
    }
  },
  render (h, {props, data}) {
    const {interval, aScale, rScale} = props
    const aRange = aScale.range()
    const $lines = interval(rScale).map(r => {
      return h(Arc, {
        class: 'vg-gridline',
        attrs: {
          a1: aRange[0],
          a2: aRange[aRange.length - 1],
          r: r.value
        }
      })
    })
    return h('g', mergeData(data, {
      class: 'vg-gridlines vg-r-gridlines'
    }), $lines)
  }
}
