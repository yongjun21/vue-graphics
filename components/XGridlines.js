export default {
  functional: true,
  props: {
    xInterval: {
      type: Array,
      required: true
    },
    yRange: {
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
    const {xInterval, yRange, xScale, yScale} = props
    const $lines = xInterval.map(x => {
      if (typeof x !== 'object') x = {label: x, value: x}
      return h('line', {
        class: 'vg-gridline',
        attrs: {
          x1: xScale(x.value),
          x2: xScale(x.value),
          y1: yScale(yRange[0]),
          y2: yScale(yRange[1])
        }
      })
    })
    return h('g', {
      class: 'vg-gridlines vg-x-gridlines'
    }, $lines)
  }
}
