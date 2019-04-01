import {TransformHelper} from '../helpers'

export default {
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
    dx: {
      type: Number,
      default: 0
    },
    dy: {
      type: Number,
      default: 0
    },
    anchor: {
      validator: v => ['topleft', 'top', 'topright', 'right', 'bottomright', 'bottom', 'bottomleft', 'left', 'middle'].includes(v)
    },
    rotate: Number,
    postTransform: TransformHelper,
    tickLength: Number
  },
  render (h, {props, children}) {
    const offset = new TransformHelper().rotate(props.rotate).apply([props.dx, props.dy])
    return h('g', {
      class: 'vg-text-label',
      attrs: {transform: getTransform(props)}
    }, [
      props.tickLength && h('line', {attrs: getLineAttrs(props, offset)}),
      h('text', {attrs: getTextAttrs(props, offset)}, children)
    ])
  }
}

function getTransform (props) {
  if (props.postTransform == null) {
    return props.rotate ? `rotate(${props.rotate})` : null
  }
  const origin = [props.x, props.y]
  const t = new TransformHelper(origin)
  if (props.rotate) t.rotate(props.rotate)
  return t.chain(props.postTransform.textCorrection(origin)).toString()
}

function getTextAttrs (props, offset) {
  const anchor = props.anchor || getDefaultAnchor(offset)
  return {
    x: props.x + offset[0],
    y: props.y + offset[1],
    'dy': ['topleft', 'top', 'topright'].includes(anchor) ? '0.7em'
        : ['bottomleft', 'bottom', 'bottomright'].includes(anchor) ? '0'
        : '0.35em',
    'text-anchor': ['topleft', 'left', 'bottomleft'].includes(anchor) ? 'start'
                : ['topright', 'right', 'bottomright'].includes(anchor) ? 'end'
                : 'middle'
  }
}

function getLineAttrs (props, offset) {
  const offsetLength = Math.sqrt(Math.pow(offset[0], 2) + Math.pow(offset[1], 2))
  return {
    x1: props.x,
    y1: props.y,
    x2: props.x + offset[0],
    y2: props.y + offset[1],
    'stroke-dasharray': offsetLength,
    'stroke-dashoffset': offsetLength - props.tickLength
  }
}

function getDefaultAnchor (offset) {
  if (offset[0] === 0 && offset[1] === 0) return 'middle'
  if (offset[0] === 0 || Math.abs(offset[1] / offset[0]) > 1) {
    return offset[1] > 0 ? 'top' : 'bottom'
  } else {
    return offset[0] > 0 ? 'left' : 'right'
  }
}
