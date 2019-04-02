import {TextLabel} from '../elements'

export default {
  name: 'YAxis',
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
      default: v => v
    },
    yScale: {
      type: Function,
      default: v => v
    }
  },
  render (h, {props, data}) {
    const {yScale} = props
    const yInterval = props.yInterval.map(y => typeof y !== 'object' ? {label: y, value: y} : y)
    const yRange = props.yRange || [yInterval[0].value, yInterval[yInterval.length - 1].value]
    const x = props.xScale(props.xAnchor)

    const $baseline = h('line', {
      class: 'vg-baseline',
      attrs: {
        x1: x,
        x2: x,
        y1: yScale(yRange[0]),
        y2: yScale(yRange[1])
      }
    })

    const $labels = yInterval.map(y => {
      return h(TextLabel, {
        attrs: Object.assign({
          x: x,
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
