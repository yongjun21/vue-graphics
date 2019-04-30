import {polar2xy, mergeData} from '../util'

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
  render (h, {props, data, scopedSlots}) {
    const origin = polar2xy([props.a, props.r])
    const attrs = getTextAttrs(props, origin)
    const $children = scopedSlots.default && scopedSlots.default(attrs)
    return h('text', mergeData(data, {
      class: 'vg-text-label',
      attrs
    }), $children)
  }
}

function getTextAttrs (props, origin) {
  const anchor = props.anchor
  return {
    x: origin[0],
    y: origin[1],
    'dy': anchor === 'top' ? '0.7em'
        : anchor === 'bottom' ? '0'
        : '0.35em',
    'text-anchor': anchor === 'left' ? 'start'
                 : anchor === 'right' ? 'end'
                 : 'middle',
    transform: `rotate(${props.a + props.rotate} ${origin[0]} ${origin[1]})`
  }
}
