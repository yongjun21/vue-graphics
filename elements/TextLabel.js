import {TransformHelper} from '../helpers'
import {mergeData} from '../util'

export default {
  name: 'TextLabel',
  functional: true,
  props: {
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    },
    anchor: {
      validator: prop => [
        'topleft',
        'top',
        'topright',
        'right',
        'bottomright',
        'bottom',
        'bottomleft',
        'left',
        'middle'
      ].includes(prop),
      default: 'middle'
    },
    rotate: Number,
    postTransform: TransformHelper
  },
  render (h, {props, data, scopedSlots}) {
    const $children = scopedSlots.default && scopedSlots.default()
    return h('text', mergeData(data, {
      class: 'vg-text-label',
      attrs: getTextAttrs(props)
    }), $children)
  }
}

function getTransform (props) {
  const origin = [props.x, props.y]
  let t = new TransformHelper()
  if (props.rotate) t.rotate(props.rotate, origin)
  if (props.postTransform) t = t.chain(props.postTransform.textCorrection(origin))
  return t.isIdentity() ? null : t.toString()
}

function getTextAttrs (props) {
  const anchor = props.anchor
  return {
    x: props.x,
    y: props.y,
    'dy': ['topleft', 'top', 'topright'].includes(anchor) ? '0.7em'
        : ['bottomleft', 'bottom', 'bottomright'].includes(anchor) ? '0'
        : '0.35em',
    'text-anchor': ['topleft', 'left', 'bottomleft'].includes(anchor) ? 'start'
                : ['topright', 'right', 'bottomright'].includes(anchor) ? 'end'
                : 'middle',
    transform: getTransform(props)
  }
}
