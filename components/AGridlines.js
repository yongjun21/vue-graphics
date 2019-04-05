import {mergeData} from '../util'

export default {
  name: 'AGridlines',
  functional: true,
  props: {
    interval: {
      type: Function,
      required: true
    },
    aScale: {
      type: Function,
      required: true
    },
    rScale: {
      type: Function,
      required: true
    }
  },
  render (h, {props, data}) {
    const {interval, aScale, rScale} = props
    const rRange = rScale.range()
    const $lines = interval(aScale).map(a => {
      return h('line', {
        class: 'vg-gridline',
        attrs: {
          x1: 0,
          x2: 0,
          y1: rRange[0],
          y2: rRange[rRange.length - 1],
          transform: `rotate(${toRad(a.value)})`
        }
      })
    })
    return h('g', mergeData(data, {
      class: 'vg-gridlines vg-x-gridlines'
    }), $lines)
  }
}

function toRad (deg) {
  return (deg - 90) * Math.PI / 180
}
