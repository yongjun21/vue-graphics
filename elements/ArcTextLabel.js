import Arc from './Arc'
import {getUid, polar2xy, mergeData} from '../util'

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
    anchor: {
      validator: prop => [
        'top',
        'right',
        'bottom',
        'left'
      ].includes(prop),
      default: 'left'
    },
    rotate: {
      validator: prop => [
        -90,
        0,
        90,
        180
      ].includes(prop),
      default: -90
    }
  },
  render (h, {props, data, children}) {
    const guideId = getUid('guide-')

    const $guide = h(Arc, {
      attrs: {id: guideId},
      props: {
        a1: -90,
        a2: 90,
        r: props.r
      }
    })

    const $label = h('text', mergeData(data, {
      class: 'vg-text-label',
      attrs: {
        'dy': '0.35em',
        'text-anchor': 'middle',
        transform: `rotate(${props.a})`
      }
    }), [
      h('textPath', {
        attrs: {
          'xlink:href': '#' + guideId, // for backward compatibility
          href: '#' + guideId,
          startOffset: '50%'
        }
      }, children)
    ])

    return h('g', [
      $guide,
      $label
    ])
  }
}
