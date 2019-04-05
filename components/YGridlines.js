import {mergeData} from '../util'

export default {
  name: 'YGridlines',
  functional: true,
  props: {
    interval: {
      type: Function,
      required: true
    },
    xScale: {
      type: Function,
      required: true
    },
    yScale: {
      type: Function,
      required: true
    }
  },
  render (h, {props, data}) {
    const {interval, xScale, yScale} = props
    const xRange = xScale.range()
    const $lines = interval(yScale).map(y => {
      return h('line', {
        class: 'vg-gridline',
        attrs: {
          x1: xRange[0],
          x2: xRange[xRange.length - 1],
          y1: y.value,
          y2: y.value
        }
      })
    })
    return h('g', mergeData(data, {
      class: 'vg-gridlines vg-y-gridlines'
    }), $lines)
  }
}
