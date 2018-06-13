import {mergeClass} from '../util'

export default {
  functional: true,
  props: {
    scale: {
      type: Function,
      required: true
    },
    domain: {
      type: Array,
      required: true
    },
    extent: {
      type: Array,
      required: true
    },
    horizontal: null
  },
  render (h, {data, props}) {
    const {scale, extent} = props
    const $lines = props.domain.map((key, i) => {
      return h('line', {
        attrs: {
          x1: extent[0],
          x2: extent[1],
          transform: `translate(0, ${scale(key)})`,
          'stroke': '#888'
        }
      })
    })

    data.class = mergeClass('vg-gridlines', data.class)
    data.attrs = data.attrs || {}
    data.attrs.transform = props.horizontal != null && 'matrix(0, 1, 1, 0, 0, 0)'

    return h('g', data, $lines)
  }
}
