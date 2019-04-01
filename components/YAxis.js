import {TextLabel} from '../elements'

export default {
  functional: true,
  props: {
    yInterval: {
      type: Array,
      required: true
    },
    yRange: Array,
    xAnchor: {
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
    const {xAnchor, xScale, yScale} = props
    const yInterval = props.yInterval.map(y => typeof y !== 'object' ? {label: y, value: y} : y)
    const yRange = props.yRange || [yInterval[0].value, yInterval[yInterval.length - 1].value]

    const $baseline = h('line', {
      class: 'vg-baseline',
      attrs: {
        x1: xScale(xAnchor),
        x2: xScale(xAnchor),
        y1: yScale(yRange[0]),
        y2: yScale(yRange[1])
      }
    })

    const $labels = yInterval.map(y => {
      return h(TextLabel, {
        attrs: Object.assign({
          x: xScale(xAnchor),
          y: yScale(y.value)
        }, data.attrs)
      }, y.label)
    })

    return h('g', {
      class: 'vg-axis vg-y-axis'
    }, [
      $baseline,
      h('g', {class: 'vg-axis-labels'}, $labels)
    ])
  }
}
