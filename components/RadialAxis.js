import {path} from 'd3-path'

export default {
  functional: true,
  render (h, {data, props}) {
    props = Object.assign({
      tickLength: 6,
      tickPadding: 3,
      labelPadding: 100
    }, props)
    const {center, radius, scale, domain, tickLength, tickPadding, labelPadding, extrapolate} = props
    const range = domain.map(scale)
    const minA = range.reduce((min, a) => a < min ? a : min, Infinity)
    const maxA = range.reduce((max, a) => a > max ? a : max, -Infinity)
    const midA = (minA + maxA) / 2
    const onLeft = Math.cos(midA) < 0

    let x1 = radius
    let x2 = x1 + tickLength
    let x3 = x2 + tickPadding

    const baseline = path()
    baseline.moveTo(x1, 0)
    baseline.arc(0, 0, x1, 0, extrapolate != null ? 2 * Math.PI : maxA - minA)
    const $baseline = h('path', {
      attrs: {
        d: baseline.toString(),
        transform: getRotation(minA),
        'fill': 'none'
      }
    })

    const $axisLabel = props.label && h('text', {
      attrs: {
        y: -(radius + labelPadding),
        transform: getRotation(midA + Math.PI / 2),
        'text-anchor': 'middle'
      }
    }, props.label)

    if (onLeft) {
      x1 = -x1
      x2 = -x2
      x3 = -x3
    }

    const tickLabelGenerator = (data.scopedSlots && data.scopedSlots.default) ||
                               (data => h('text', data, data.key))

    const $tickMarks = []
    const $tickLabels = []

    domain.forEach((key, i) => {
      const transform = getRotation(range[i] + (onLeft ? Math.PI : 0))
      const $tickMark = h('line', {
        attrs: {x1, x2, transform}
      })
      const $tickLabel = tickLabelGenerator({
        key,
        attrs: {
          x: x3,
          dy: '0.35em',
          transform,
          'text-anchor': onLeft ? 'end' : 'start'
        }
      })
      $tickMarks.push($tickMark)
      $tickLabels.push($tickLabel)
    })

    data.attrs = data.attrs || {}
    data.attrs.transform = `translate(${center[0]} ${center[1]})`

    return h('g', data, [
      $baseline,
      h('g', $tickMarks),
      h('g', $tickLabels),
      $axisLabel
    ])
  }
}

function getRotation (a) {
  const deg = a * 180 / Math.PI
  return `rotate(${deg})`
}
