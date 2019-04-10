import TextLabel from '../elements/TextLabel'
import {wrapListeners} from '../util'

export default {
  name: 'YAxis',
  functional: true,
  props: {
    interval: {
      type: Function,
      required: true
    },
    xTranslate: {
      type: Number,
      default: 0
    },
    xScale: {
      type: Function,
      default: v => v
    },
    yScale: {
      type: Function,
      required: true
    },
    tickSize: {
      type: Number,
      default: 6
    },
    tickPadding: {
      type: Number,
      default: 3
    }
  },
  render (h, {props, data}) {
    const {interval, xTranslate, xScale, yScale, tickSize, tickPadding} = props
    const x = xScale(xTranslate)
    const yRange = yScale.range()

    const $baseline = h('line', {
      class: 'vg-baseline',
      attrs: {
        x1: x,
        x2: x,
        y1: yRange[0],
        y2: yRange[yRange.length - 1]
      }
    })

    const $ticks = interval(yScale).map(y => {
      const $label = h(TextLabel, {
        key: y.label,
        class: y.class,
        attrs: Object.assign({}, data.attrs, {
          x: x - tickSize - tickPadding,
          y: y.value,
          for: y.label
        })
      }, y.formatted || y.label.toString())

      const $mark = h('line', {
        attrs: {
          x1: x,
          x2: x - tickSize,
          y1: y.value,
          y2: y.value
        }
      })

      return h('g', {class: 'vg-tick'}, [$label, tickSize && $mark])
    })

    const $listeners = data.on &&
      wrapListeners(data.on, el => el.getAttribute('for'), 'text')

    return h('g', {
      class: 'vg-axis vg-y-axis'
    }, [
      $baseline,
      h('g', {on: $listeners}, $ticks)
    ])
  }
}
