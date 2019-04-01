import {TextLabel} from '../elements'

export default {
  functional: true,
  props: {
    xInterval: {
      type: Array,
      required: true
    },
    xRange: Array,
    yAnchor: {
      type: Number,
      default: 0
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
  render (h, {props, data}) {
    const {yAnchor, xScale, yScale} = props
    const xInterval = props.xInterval.map(x => typeof x !== 'object' ? {label: x, value: x} : x)
    const xRange = props.xRange || [xInterval[0].value, xInterval[xInterval.length - 1].value]

    const $baseline = h('line', {
      class: 'vg-baseline',
      attrs: {
        x1: xScale(xRange[0]),
        x2: xScale(xRange[1]),
        y1: yScale(yAnchor),
        y2: yScale(yAnchor)
      }
    })

    const $labels = xInterval.map(x => {
      return h(TextLabel, {
        attrs: Object.assign({
          x: xScale(x.value),
          y: yScale(yAnchor)
        }, data.attrs)
      }, x.label)
    })

    return h('g', {
      class: 'vg-axis vg-x-axis'
    }, [
      $baseline,
      h('g', {class: 'vg-axis-labels'}, $labels)
    ])
  }
}
