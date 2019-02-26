import {path} from 'd3-path'
import {orientateText, getUid, mergeClass} from '../util'

export default {
  functional: true,
  props: {
    placement: {
      validator (value) {
        return ['inside', 'outside'].indexOf(value) > -1
      },
      default: 'outside'
    },
    anchor: {
      type: Array,
      default: () => [0, 0]
    },
    radius: {
      type: Number,
      required: true
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
    labelPadding: {
      type: Number,
      default: 100
    }
  },
  render (h, {data, props}) {
    if (props.placement === 'inside') {
      props.tickLength = props.tickLength * -1
      props.tickPadding = props.tickPadding * -1
      props.labelPadding = props.labelPadding * -1
    }

    const range = props.domain.map(props.scale)
    const extent = props.extrapolate == null ? range : props.scale.range()
    
    const minA = extent.reduce((min, a) => a < min ? a : min, Infinity)
    const maxA = extent.reduce((max, a) => a > max ? a : max, -Infinity)
    const midA = (minA + maxA) / 2
    const onLeft = Math.cos(midA * Math.PI / 180) < 0
    const onTop = Math.sin(midA * Math.PI / 180) >= 0

    if (props.tickAnchor == null) {
      if (props.placement === 'inside') {
        props.tickAnchor = onLeft ? 'left' : 'right'
      } else {
        props.tickAnchor = onLeft ? 'right' : 'left'
      }
    }

    const baseline = path()
    baseline.moveTo(props.radius, 0)
    baseline.arc(0, 0, props.radius, 0, (maxA - minA) * Math.PI / 180)
    const $baseline = h('path', {
      class: 'vg-baseline',
      attrs: {
        d: baseline.toString(),
        transform: `rotate(${minA})`,
        'stroke': '#888',
        'fill': 'none'
      }
    })

    const tickLabelGenerator = (data.scopedSlots && data.scopedSlots.tickLabel) ||
                               (data => h('text', data, data.id))

    const axisLabelGenerator = (data.scopedSlots && data.scopedSlots.axisLabel) ||
                               (({text, textPath}) => h('text', text, [h('textPath', textPath, props.label)]))

    const $ticks = props.domain.map((key, i) => {
      const transform = `rotate(${range[i]}) translate(${props.radius} 0)`
      const $tickMark = h('line', {
        class: 'vg-tick-mark',
        attrs: {x2: props.tickLength, 'stroke': '#888'}
      })
      const $tickLabel = tickLabelGenerator({
        id: key,
        class: 'vg-tick-label',
        attrs: getTextAttrs(
          props.tickAnchor,
          [props.tickLength + props.tickPadding, 0],
          props.tickRotate
        )
      })
      return h('g', {
        key,
        attrs: {transform}
      }, [
        $tickMark,
        $tickLabel
      ])
    })

    const rLabel = props.radius + props.labelPadding
    const guideId = getUid()
    const guide = path()
    guide.moveTo(-rLabel, 0)
    guide.arc(0, 0, rLabel, -Math.PI, 0, onTop)
    const $axisLabelGuide = h('defs', [
      h('path', {
        attrs: {
          id: guideId,
          d: guide.toString()
        }
      })
    ])

    const $axisLabel = props.label && axisLabelGenerator({
      text: {
        class: 'vg-axis-label',
        attrs: {
          dy: '0.35em',
          transform: `rotate(${midA + (onTop ? -90 : 90)})`,
          'text-anchor': 'middle',
          'fill': '#666'
        }
      },
      textPath: {
        attrs: {
          'xlink:href': '#' + guideId, // for backward compatibility
          href: '#' + guideId,
          startOffset: '50%'
        }
      },
      props: {minA, maxA}
    })

    data.class = mergeClass('vg-axis vg-radial-axis', data.class)
    data.attrs = data.attrs || {}
    data.attrs.transform = `translate(${props.anchor[0]} ${props.anchor[1]})`

    return h('g', data, [
      $baseline,
      h('g', $ticks),
      $axisLabelGuide,
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
