import {mergeData} from '../util'

export default {
  name: 'XGridlines',
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
    const yRange = yScale.range()
    const $lines = interval(xScale).map(x => {
      return h('line', {
        class: 'vg-gridline',
        attrs: {
          x1: x.value,
          x2: x.value,
          y1: yRange[0],
          y2: yRange[yRange.length - 1]
        }
      })
    })
    return h('g', mergeData(data, {
      class: 'vg-gridlines vg-x-gridlines'
    }), $lines)
  }
}
