import {path} from 'd3-path'
import {mapRadialToCartesian} from '../util'

export default {
  functional: true,
  render (h, {props, listeners}) {
    props.tickLength = props.tickLength || 6
    props.tickPadding = props.tickPadding || 3
    props.formatter = props.formatter || (key => key)
    const {center, radius, scale, domain, formatter, tickLength, tickPadding} = props

    const range = domain.map(scale)
    const minA = range.reduce((min, a) => a < min ? a : min, Infinity)
    const maxA = range.reduce((max, a) => a > max ? a : max, -Infinity)
    const onLeft = Math.cos((minA + maxA) / 2) >= 0

    const baseline = path()
    baseline.moveTo(...mapRadialToCartesian(minA, radius, center))
    baseline.arc(...center, radius, minA, maxA)
    const $baseline = h('path', {
      attrs: {
        d: baseline.toString(),
        stroke: 'black'
      }
    })

    const $ticks = domain.map((key, i) => {
      let x1 = radius
      let x2 = radius + tickLength
      let x = radius + tickLength + tickPadding
      let deg = range[i] * 180 / Math.PI
      if (onLeft) {
        x1 = -x1
        x2 = -x2
        x = -x
        deg += 180
      }
      const transform = `rotate(${deg} ${center[0]} ${center[1]}) translate(${center[0]} ${center[1]})`

      const eventListeners = {}
      Object.keys(listeners).forEach(event => {
        eventListeners[event] = () => listeners[event](key)
      })

      const $tickMark = h('line', {
        attrs: {x1, x2, transform}
      })

      const $tickLabel = h('text', {
        attrs: {x, transform, dy: '0.35em', 'text-anchor': onLeft ? 'end' : 'start'},
        on: eventListeners
      }, formatter(key))

      return h('g', {key}, [$tickMark, $tickLabel])
    })

    return h('g', [
      $baseline,
      ...$ticks
    ])
  }
}
