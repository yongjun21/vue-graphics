import {path} from 'd3-path'
import {orientateText, uniqueHash} from '../util'

export default {
  functional: true,
  props: {
    center: {
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
    const range = props.domain.map(props.scale)
    const minA = range.reduce((min, a) => a < min ? a : min, Infinity)
    const maxA = range.reduce((max, a) => a > max ? a : max, -Infinity)
    const midA = (minA + maxA) / 2
    const onLeft = Math.cos(midA) < 0
    const onTop = Math.sin(midA) >= 0

    const baseline = path()
    baseline.moveTo(props.radius, 0)
    baseline.arc(0, 0, props.radius, 0, props.extrapolate != null ? 2 * Math.PI : maxA - minA)
    const $baseline = h('path', {
      attrs: {
        d: baseline.toString(),
        transform: getRotation(minA),
        'fill': 'none'
      }
    })

    const tickLabelGenerator = (data.scopedSlots && data.scopedSlots.tickLabel) ||
                               (data => h('text', data, data.id))

    const axisLabelGenerator = (data.scopedSlots && data.scopedSlots.axisLabel) ||
                               (({text, textPath}) => h('text', text, [h('textPath', textPath, props.label)]))

    const $ticks = props.domain.map((key, i) => {
      const transform = `${getRotation(range[i])} translate(${props.radius} 0)`
      const $tickMark = h('line', {
        attrs: {x2: props.tickLength, 'stroke': '#888'}
      })
      const $tickLabel = tickLabelGenerator({
        id: key,
        attrs: getTextAttrs(
          onLeft ? 'right' : 'left',
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
    const guideId = uniqueHash()
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

    const $axisLabel = axisLabelGenerator({
      text: {
        attrs: {
          dy: '0.35em',
          transform: getRotation(midA + (onTop ? -1 : 1) * Math.PI / 2),
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

    data.attrs = data.attrs || {}
    data.attrs.transform = `translate(${props.center[0]} ${props.center[1]})`

    return h('g', data, [
      $baseline,
      h('g', $ticks),
      $axisLabelGuide,
      $axisLabel
    ])
  }
}

function getRotation (a) {
  const deg = a * 180 / Math.PI
  return `rotate(${deg})`
}

function getTextAttrs (anchor, offset, rotate) {
  return Object.assign(
    {fill: '#666'},
    orientateText(anchor, offset, rotate)
  )
}
