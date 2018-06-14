import {orientateText, mergeClass} from '../util'

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
      type: Array,
      default: () => [0, 0]
    },
    angle: {
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

    const extent = props.extrapolate == null ? range : props.scale.range()

    const minD = extent.reduce((min, d) => d < min ? d : min, Infinity)
    const maxD = extent.reduce((max, d) => d > max ? d : max, -Infinity)
    const midD = (minD + maxD) / 2

    const $baseline = h('line', {
      class: 'vg-baseline',
      attrs: {
        x1: minD,
        x2: maxD,
        'stroke': '#888',
        'fill': 'none'
      }
    })

    const tickLabelGenerator = (data.scopedSlots && data.scopedSlots.tickLabel) ||
                               (data => h('text', data, data.id))
    const axisLabelGenerator = (data.scopedSlots && data.scopedSlots.axisLabel) ||
                               (data => h('text', data, data.label))

    const $ticks = props.domain.map((key, i) => {
      const $tickMark = h('line', {
        class: 'vg-tick-mark',
        attrs: {
          y2: props.tickLength,
          'stroke': '#888',
          'fill': 'none'
        }
      })
      const $tickLabel = tickLabelGenerator({
        id: key,
        class: 'vg-tick-label',
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

    const $axisLabel = props.label && axisLabelGenerator({
      label: props.label,
      class: 'vg-axis-label',
      attrs: getTextAttrs(
        'center',
        [midD, props.labelPadding],
        horizontal ? 0 : 180
      )
    })

    data.class = mergeClass('vg-axis vg-linear-axis', data.class)
    data.attrs = data.attrs || {}
    data.attrs.transform = horizontal
                         ? `translate(0 ${props.anchor[1]})`
                         : `translate(${props.anchor[0]} 0) rotate(90)`
    if (props.angle) {
      data.attrs.transform = `rotate(${props.angle} ${props.anchor[0]} ${props.anchor[1]}) ${data.attrs.transform}`
    }

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
