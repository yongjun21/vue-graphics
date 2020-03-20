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
    const attrs = getTextAttrs(props)
    const $children = scopedSlots.default && scopedSlots.default(attrs)
    return h('text', mergeData(data, {
      class: 'vg-text-label',
      attrs
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
    'dy': anchor.includes('top') ? '0.7em'
        : anchor.includes('bottom') ? '0'
        : '0.35em',
    'text-anchor': anchor.includes('left') ? 'start'
                : anchor.includes('right') ? 'end'
                : 'middle',
    transform: getTransform(props)
  }
}
