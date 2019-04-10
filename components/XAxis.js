import TextLabel from '../elements/TextLabel'
import {wrapListeners} from '../util'

export default {
  name: 'XAxis',
  functional: true,
  props: {
    interval: {
      type: Function,
      required: true
    },
    yTranslate: {
      type: Number,
      default: 0
    },
    xScale: {
      type: Function,
      required: true
    },
    yScale: {
      type: Function,
      default: v => v
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
    const {interval, yTranslate, xScale, yScale, tickSize, tickPadding} = props
    const y = yScale(yTranslate)
    const xRange = xScale.range()

    const $baseline = h('line', {
      class: 'vg-baseline',
      attrs: {
        x1: xRange[0],
        x2: xRange[xRange.length - 1],
        y1: y,
        y2: y
      }
    })

    const $ticks = interval(xScale).map(x => {
      const $label = h(TextLabel, {
        key: x.label,
        class: x.class,
        attrs: Object.assign({}, data.attrs, {
          x: x.value,
          y: y - tickSize - tickPadding,
          for: x.label
        })
      }, x.formatted || x.label.toString())

      const $mark = h('line', {
        attrs: {
          x1: x.value,
          x2: x.value,
          y1: y,
          y2: y - tickSize
        }
      })

      return h('g', {class: 'vg-tick'}, [$label, tickSize && $mark])
    })

    const $listeners = data.on &&
      wrapListeners(data.on, el => el.getAttribute('for'), 'text')

    return h('g', {
      class: 'vg-axis vg-x-axis'
    }, [
      $baseline,
      h('g', {on: $listeners}, $ticks)
    ])
  }
}
