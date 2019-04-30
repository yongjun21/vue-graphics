import Arc from './Arc'
import {getUid, mergeData} from '../util'

export default {
  name: 'TextLabel',
  functional: true,
  props: {
    a: {
      type: Number,
      required: true
    },
    r: {
      type: Number,
      required: true
    },
    concave: {
      validator: prop => [true, false, null].includes(prop),
      default: null
    }
  },
  render (h, {props, data, scopedSlots}) {
    const concave = props.concave == null ? isConcave(props) : props.concave
    const guideId = getUid('guide-')

    const $guide = h('defs', [
      h(Arc, {
        attrs: {id: guideId},
        props: {
          a1: concave ? 270 : -90,
          a2: 90,
          r: props.r
        }
      })
    ])

    const $children = scopedSlots.default && scopedSlots.default()

    const $label = h('text', mergeData(data, {
      class: 'vg-text-label',
      attrs: {
        'dy': '0.35em',
        'text-anchor': 'middle',
        transform: `rotate(${concave ? props.a + 180 : props.a})`
      }
    }), [
      h('textPath', {
        attrs: {
          'xlink:href': '#' + guideId, // for backward compatibility
          href: '#' + guideId,
          startOffset: '50%'
        }
      }, $children)
    ])

    return h('g', [
      $guide,
      $label
    ])
  }
}

function isConcave (props) {
  let a = props.a
  if (props.r < 0) a += 180
  a = a % 360
  if (a < 0) a += 360
  return a > 90 && a < 270
}
