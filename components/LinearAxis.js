export default {
  functional: true,
  render (h, {data, props}) {
    props = Object.assign({
      tickLength: 6,
      tickPadding: 3,
      labelPadding: 100
    }, props)
    const {offset, scale, domain, tickLength, tickPadding, labelPadding, extrapolate} = props
    const horizontal = props.horizontal != null

    let range = domain.map(scale)
    if (typeof scale.bandwidth === 'function') {
      range = range.map(v => v + scale.bandwidth() / 2)
    }

    const minD = range.reduce((min, d) => d < min ? d : min, Infinity)
    const maxD = range.reduce((max, d) => d > max ? d : max, -Infinity)
    const midD = (minD + maxD) / 2

    let $baseline
    if (extrapolate == null) {
      $baseline = h('line', {
        attrs: horizontal ? {x1: minD, x2: maxD} : {y1: minD, y2: maxD}
      })
    } else {
      const extend = scale.range()
      const min = extend[0]
      const max = extend[extend.length - 1]
      $baseline = h('line', {
        attrs: horizontal ? {x1: min, x2: max} : {y1: min, y2: max}
      })
    }

    const tickLabelGenerator = (data.scopedSlots && data.scopedSlots.default) ||
                               (data => h('text', data, data.key))

    const $tickMarks = []
    const $tickLabels = []

    domain.forEach((key, i) => {
      const transform = horizontal ? `translate(${range[i]} 0)` : `translate(0 ${range[i]})`
      const $tickMark = h('line', {
        attrs: horizontal
          ? {y2: tickLength, transform}
          : {x2: -tickLength, transform}
      })
      const $tickLabel = tickLabelGenerator({
        key,
        attrs: horizontal ? {
          y: tickLength + tickPadding,
          dy: '0.70em',
          transform,
          'text-anchor': 'middle'
        } : {
          x: -(tickLength + tickPadding),
          dy: '0.35em',
          transform,
          'text-anchor': 'end'
        }
      })
      $tickMarks.push($tickMark)
      $tickLabels.push($tickLabel)
    })

    const $axisLabel = props.label && h('text', {
      attrs: horizontal ? {
        y: labelPadding,
        dy: '0.70em',
        transform: `translate(${midD} 0)`,
        'text-anchor': 'middle'
      } : {
        x: -labelPadding,
        dy: '0.35em',
        transform: `translate(0 ${midD})`,
        'text-anchor': 'end'
      }
    }, props.label)

    data.attrs = data.attrs || {}
    data.attrs.transform = `translate(${horizontal ? 0 : offset} ${horizontal ? offset : 0})`

    return h('g', data, [
      $baseline,
      h('g', $tickMarks),
      h('g', $tickLabels),
      $axisLabel
    ])
  }
}
