import Arc from '../elements/Arc'
import RadialTextLabel from '../elements/RadialTextLabel'
import {wrapListeners} from '../util'

export default {
  name: 'AAxis',
  functional: true,
  props: {
    interval: {
      type: Function,
      required: true
    },
    r: {
      type: Number,
      default: 0
    },
    aScale: {
      type: Function,
      required: true
    },
    rScale: {
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
    const {interval, aScale, rScale, tickSize, tickPadding} = props
    const r = rScale(props.r)
    const aRange = aScale.range()
    const ccw = aRange[0] > aRange[1]

    const $baseline = h(Arc, {
      class: 'vg-baseline',
      props: {
        a1: aRange[0],
        a2: aRange[1],
        r
      }
    })

    const $ticks = interval(aScale).map(a => {
      const $label = h(RadialTextLabel, {
        attrs: Object.assign({}, data.attrs, {
          a: a.value,
          r: r + tickSize + tickPadding,
          anchor: ccw ? 'right' : 'left',
          rotate: ccw ? 90 : -90,
          for: a.label
        })
      }, a.formatted || a.label.toString())

      const $mark = h('line', {
        attrs: {
          x1: 0,
          x2: 0,
          y1: -r,
          y2: -(r + tickSize),
          transform: `rotate(${a.value})`
        }
      })

      return h('g', {class: 'vg-tick'}, [$label, tickSize && $mark])
    })

    const $listeners = data.on &&
      wrapListeners(data.on, el => el.getAttribute('for'), 'text')

    return h('g', {
      class: 'vg-axis vg-a-axis'
    }, [
      $baseline,
      h('g', {on: $listeners}, $ticks)
    ])
  }
}
