export default {
  functional: true,
  render (h, {data, props}) {
    const horizontal = props.horizontal != null
    props = Object.assign({
      tickLength: 6,
      tickPadding: 3,
      labelPadding: horizontal ? 30 : 60
    }, props)
    const {anchor, scale, domain, tickLength, tickPadding, labelPadding, extrapolate} = props

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
        attrs: {
          [horizontal ? 'x1' : 'y1']: minD,
          [horizontal ? 'x2' : 'y2']: maxD,
          'stroke': '#888'
        }
      })
    } else {
      const extend = scale.range()
      const min = extend[0]
      const max = extend[extend.length - 1]
      $baseline = h('line', {
        attrs: {
          [horizontal ? 'x1' : 'y1']: min,
          [horizontal ? 'x2' : 'y2']: max,
          'stroke': '#888'
        }
      })
    }

    const tickLabelGenerator = (data.scopedSlots && data.scopedSlots.tickLabel) ||
                               (data => h('text', data, data.key))

    const $tickMarks = []
    const $tickLabels = []

    domain.forEach((key, i) => {
      const transform = horizontal ? `translate(${range[i]} 0)` : `translate(0 ${range[i]})`
      const $tickMark = h('line', {
        attrs: horizontal
          ? {y2: tickLength, transform, 'stroke': '#888'}
          : {x2: -tickLength, transform, 'stroke': '#888'}
      })
      const $tickLabel = tickLabelGenerator({
        key,
        attrs: horizontal ? {
          y: tickLength + tickPadding,
          dy: '0.70em',
          transform,
          'text-anchor': 'middle',
          'fill': '#666'
        } : {
          x: -(tickLength + tickPadding),
          dy: '0.35em',
          transform,
          'text-anchor': 'end',
          'fill': '#666'
        }
      })
      $tickMarks.push($tickMark)
      $tickLabels.push($tickLabel)
    })

    const $axisLabel = props.label && h('text', {
      attrs: horizontal ? {
        dy: '0.70em',
        transform: `translate(${midD} ${labelPadding})`,
        'text-anchor': 'middle',
        'fill': '#666'
      } : {
        transform: `translate(${-labelPadding} ${midD}) rotate(-90)`,
        'text-anchor': 'middle',
        'fill': '#666'
      }
    }, props.label)

    data.attrs = data.attrs || {}
    data.attrs.transform = `translate(${horizontal ? 0 : anchor} ${horizontal ? anchor : 0})`

    return h('g', data, [
      $baseline,
      h('g', $tickMarks),
      h('g', $tickLabels),
      $axisLabel
    ])
  }
}
