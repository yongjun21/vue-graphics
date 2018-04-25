import {path} from 'd3-path'
import {mapRadialToCartesian} from '../util'

export default {
  functional: true,
  render (h, {data, props}) {
    props = Object.assign({
      tickLength: 6,
      innerPadding: 0,
      outerPadding: 3,
      formatter: key => key
    }, props)
    const {center, radius, scale, domain, formatter, tickLength, innerPadding, outerPadding} = props
    const range = domain.map(scale)
    const minA = range.reduce((min, a) => a < min ? a : min, Infinity)
    const maxA = range.reduce((max, a) => a > max ? a : max, -Infinity)
    const onLeft = Math.cos((minA + maxA) / 2) < 0
    const completeArc = props.complete != null

    const baseline = path()
    baseline.moveTo(...mapRadialToCartesian(minA, radius + innerPadding, center))
    baseline.arc(...center, radius + innerPadding, minA, completeArc ? (minA + 2 * Math.PI) : maxA)
    const $baseline = h('path', {
      attrs: {
        d: baseline.toString()
      }
    })

    const $ticks = domain.map((key, i) => {
      let x1 = radius + innerPadding
      let x2 = radius + innerPadding + tickLength
      let x = radius + innerPadding + tickLength + outerPadding
      let deg = range[i] * 180 / Math.PI
      if (onLeft) {
        x1 = -x1
        x2 = -x2
        x = -x
        deg += 180
      }

      const transform = `rotate(${deg} ${center[0]} ${center[1]}) translate(${center[0]} ${center[1]})`

      let formatted = formatter(key)
      if (typeof formatted !== 'object') formatted = {text: formatted}

      const $tickMark = h('line', {
        attrs: {x1, x2, transform}
      })

      const $tickLabel = h('text', {
        attrs: {
          x,
          transform,
          'dy': '0.35em',
          'text-anchor': onLeft ? 'end' : 'start',
          'data-key': key
        }
      }, formatted.text)

      return h('g', Object.assign({key}, formatted), [$tickMark, $tickLabel])
    })

    return h('g', data, [
      $baseline,
      ...$ticks
    ])
  }
}
