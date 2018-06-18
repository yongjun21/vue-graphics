import {scalePoint, scaleLinear} from 'd3-scale'
import {line, curveStepBefore} from 'd3-shape'

import Line from '../elements/Line'
import AnimatedLine from '../elements/AnimatedLine'
import EnlargeTarget from '../directives/v-enlarge-target'

import {mergeClass} from '../util'

const lineGenerator = line().curve(curveStepBefore)

export default {
  name: 'WaterfallLine',
  directives: {EnlargeTarget},
  props: ['data', 'domain', 'highlighted', 'hoverEnabled', 'width', 'height'],
  data () {
    return {
      hoveredOn: null
    }
  },
  computed: {
    xScale () {
      const scale = scalePoint()
      scale.domain(this.domain)
      scale.rangeRound([0, this.width])
      scale.padding(0.51)
      return scale
    },
    yScale () {
      const scale = scaleLinear()
      scale.domain([-0.02, 1.02])
      scale.rangeRound([this.height, 0])
      return scale
    },
    pathString () {
      const {domain, xScale, yScale} = this
      const padding = xScale.step() / 2
      return this.data.reduce((obj, d) => {
        let cumulative = 0
        const points = []
        points.push([xScale(domain[0]) - padding, yScale(cumulative)])
        domain.forEach(key => {
          points.push([
            xScale(key) + padding,
            yScale(cumulative += d[key])
          ])
        })
        return Object.assign(obj, {[d.id]: lineGenerator(points)})
      }, {})
    }
  },
  render (h) {
    if (this.width == null || this.height == null) return h('svg')

    const {pathString, highlighted, hoveredOn, hoverEnabled} = this
    const $overlay = []
    const $lines = this.data.map(d => {
      if ((highlighted && highlighted.indexOf(d.id) > -1) || (hoverEnabled && hoveredOn === d.id)) {
        $overlay.push(h(AnimatedLine, {
          class: mergeClass(d.class, 'highlighted'),
          attrs: {
            d: pathString[d.id],
            'fill': 'none'
          }
        }))
      }
      return h(Line, {
        key: d.id,
        attrs: {
          d: pathString[d.id],
          'stroke': '#888',
          'fill': 'none'
        },
        class: d.class,
        style: d.style,
        on: {
          mouseover: () => { this.hoveredOn = d.id },
          mouseout: () => { this.hoveredOn = null }
        },
        directives: [{name: 'enlarge-target'}]
      })
    })
    return h('svg', {class: 'waterfall-line'}, [
      h('g', $lines),
      h('g', $overlay)
    ])
  }
}
