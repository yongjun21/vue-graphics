import {TextLabel} from '../elements'

export default {
  name: 'XAxis',
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
      default: v => v
    },
    yScale: {
      type: Function,
      default: v => v
    }
  },
  render (h, {props, data}) {
    const {xScale} = props
    const xInterval = props.xInterval.map(x => typeof x !== 'object' ? {label: x, value: x} : x)
    const xRange = props.xRange || [xInterval[0].value, xInterval[xInterval.length - 1].value]
    const y = props.yScale(props.yAnchor)

    const $baseline = h('line', {
      class: 'vg-baseline',
      attrs: {
        x1: xScale(xRange[0]),
        x2: xScale(xRange[1]),
        y1: y,
        y2: y
      }
    })

    const $labels = xInterval.map(x => {
      return h(TextLabel, {
        attrs: Object.assign({
          x: xScale(x.value),
          y: y
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
