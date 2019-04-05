import TextLabel from '../elements/TextLabel'
import {wrapListeners} from '../util'

export default {
  name: 'RAxis',
  functional: true,
  props: {
    interval: {
      type: Function,
      required: true
    },
    a: {
      type: Number,
      default: 0
    },
    aScale: {
      type: Function,
      default: v => v
    },
    rScale: {
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
    const {interval, aScale, rScale, tickSize, tickPadding} = props
    const a = aScale(props.a)
    const rRange = rScale.range()

    const $baseline = h('line', {
      class: 'vg-baseline',
      attrs: {
        x1: 0,
        x2: 0,
        y1: -rRange[0],
        y2: -rRange[rRange.length - 1]
      }
    })

    const $ticks = interval(rScale).map(r => {
      const $label = h(TextLabel, {
        key: r.label,
        attrs: Object.assign({}, data.attrs, {
          x: tickSize + tickPadding,
          y: -r.value,
          anchor: tickSize < 0 ? 'right' : 'left',
          for: r.label
        })
      }, r.formatted || r.label.toString())

      const $mark = h('line', {
        attrs: {
          x1: 0,
          x2: tickSize,
          y1: -r.value,
          y2: -r.value
        }
      })

      return h('g', {class: 'vg-tick'}, [$label, tickSize && $mark])
    })

    const $listeners = data.on &&
      wrapListeners(data.on, el => el.getAttribute('for'), 'text')

    return h('g', {
      class: 'vg-axis vg-ar-axis',
      attrs: {
        transform: `rotate(${a})`
      }
    }, [
      $baseline,
      h('g', {on: $listeners}, $ticks)
    ])
  }
}
