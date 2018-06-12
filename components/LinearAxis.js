import {orientateText} from '../util'

const placements = ['top', 'right', 'bottom', 'left']

export default {
  functional: true,
  props: {
    placement: {
      validator (value) {
        return placements.indexOf(value) > -1
      },
      default: 'bottom'
    },
    anchor: {
      type: Number,
      default: 0
    },
    scale: {
      type: Function,
      required: true
    },
    domain: {
      type: Array,
      required: true
    },
    extrapolate: null,
    tickLength: {
      type: Number,
      default: 6
    },
    tickPadding: {
      type: Number,
      default: 3
    },
    tickAnchor: null,
    tickRotate: {
      type: Number,
      default: 0
    },
    label: String,
    labelPadding: Number
  },
  render (h, {data, props}) {
    const horizontal = props.placement === 'top' || props.placement === 'bottom'
    if (props.labelPadding == null) props.labelPadding = horizontal ? 30 : 60
    if (props.tickAnchor == null) {
      props.tickAnchor = placements[(placements.indexOf(props.placement) + 2) % 4]
    }
    if (props.placement === 'top' || props.placement === 'right') {
      props.tickLength = props.tickLength * -1
      props.tickPadding = props.tickPadding * -1
      props.labelPadding = props.labelPadding * -1
    }

    let range = props.domain.map(props.scale)
    if (typeof props.scale.bandwidth === 'function') {
      range = range.map(v => v + props.scale.bandwidth() / 2)
    }

    const minD = range.reduce((min, d) => d < min ? d : min, Infinity)
    const maxD = range.reduce((max, d) => d > max ? d : max, -Infinity)
    const midD = (minD + maxD) / 2

    let $baseline
    if (props.extrapolate == null) {
      $baseline = h('line', {
        attrs: {
          x1: minD,
          x2: maxD,
          'stroke': '#888'
        }
      })
    } else {
      const extend = props.scale.range()
      $baseline = h('line', {
        attrs: {
          x1: extend[0],
          x2: extend[extend.length - 1],
          'stroke': '#888'
        }
      })
    }

    const tickLabelGenerator = (data.scopedSlots && data.scopedSlots.tickLabel) ||
                               (data => h('text', data, data.id))

    const $ticks = props.domain.map((key, i) => {
      const $tickMark = h('line', {
        attrs: {y2: props.tickLength, 'stroke': '#888'}
      })
      const $tickLabel = tickLabelGenerator({
        id: key,
        attrs: getTextAttrs(
          props.tickAnchor,
          [0, props.tickLength + props.tickPadding],
          props.tickRotate
        )
      })

      return h('g', {
        key,
        attrs: {transform: `translate(${range[i]} 0)`}
      }, [
        $tickMark,
        $tickLabel
      ])
    })

    const $axisLabel = props.label && h('text', {
      attrs: getTextAttrs(
        'center',
        [midD, props.labelPadding],
        horizontal ? 0 : 180
      )
    }, props.label)

    data.attrs = data.attrs || {}
    data.attrs.transform = horizontal
                         ? `translate(0 ${props.anchor})`
                         : `translate(${props.anchor} 0) rotate(90)`

    return h('g', data, [
      $baseline,
      h('g', $ticks),
      $axisLabel
    ])
  }
}

function getTextAttrs (anchor, offset, rotate) {
  return Object.assign(
    {fill: '#666'},
    orientateText(anchor, offset, rotate)
  )
}
