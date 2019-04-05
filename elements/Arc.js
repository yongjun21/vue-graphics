import {path} from 'd3-path'
import {mergeData} from '../util'

export default {
  name: 'Arc',
  functional: true,
  props: {
    a1: {
      type: [Number, String],
      required: true
    },
    a2: {
      type: [Number, String],
      required: true
    },
    r: {
      type: [Number, String],
      required: true
    },
    aScale: {
      type: Function,
      default: v => v
    },
    rScale: {
      type: Function,
      default: v => v
    }
  },
  render (h, {props, data}) {
    const {a1, a2, r, aScale, rScale} = props
    const start = aScale(a1)
    const stop = aScale(a2)
    const p = path()
    p.arc(0, 0, rScale(r), toRad(start), toRad(stop), start > stop)

    return h('path', mergeData(data, {
      class: 'vg-arc',
      attrs: Object.assign({}, data.attrs, {
        d: p.toString()
      })
    }))
  }
}

function toRad (deg) {
  return (deg - 90) * Math.PI / 180
}
