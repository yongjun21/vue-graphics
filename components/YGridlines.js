export default {
  functional: true,
  props: {
    yInterval: {
      type: Array,
      required: true
    },
    xRange: {
      type: Array,
      required: true
    },
    xScale: {
      type: Function,
      default: (v, v0 = 0) => v - v0
    },
    yScale: {
      type: Function,
      default: (v, v0 = 0) => v - v0
    }
  },
  render (h, {props}) {
    const {yInterval, xRange, xScale, yScale} = props
    const $lines = yInterval.map(y => {
      if (typeof y !== 'object') y = {label: y, value: y}
      return h('line', {
        class: 'vg-gridline',
        attrs: {
          x1: xScale(xRange[0]),
          x2: xScale(xRange[1]),
          y1: yScale(y.value),
          y2: yScale(y.value)
        }
      })
    })
    return h('g', {
      class: 'vg-gridlines vg-y-gridlines'
    }, $lines)
  }
}
