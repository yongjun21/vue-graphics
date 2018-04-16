import AnimatedLine from './chart-elements/AnimatedLine'
import {scalePoint, scaleLinear} from 'd3-scale'
import {path as d3path} from 'd3-path'

export default {
  props: ['data', 'domain', 'sized', 'width', 'height'],
  data () {
    return {
      highlight: null
    }
  },
  computed: {
    xScale () {
      const scale = scalePoint()
      scale.domain(this.domain)
      scale.rangeRound(this.width && [0, this.width])
      scale.padding(1)
      return scale
    },
    yScale () {
      const scale = scaleLinear()
      scale.domain([-0.01, 1.01])
      scale.rangeRound(this.height && [this.height, 0])
      return scale
    },
    paths () {
      if (!this.sized) return []
      const {domain, width, xScale, yScale} = this
      return this.data.map((d, i) => {
        let cumulative = 0
        const p = d3path()
        p.moveTo(0, yScale(cumulative))
        domain.forEach(point => {
          const x = xScale(point)
          p.lineTo(x, yScale(cumulative))
          cumulative += d[point]
          if (isNaN(cumulative)) console.log(JSON.stringify(d))
          p.lineTo(x, yScale(cumulative))
        })
        p.lineTo(width, yScale(cumulative))

        return {
          key: d.id,
          props: {
            attrs: {
              d: p.toString(),
              'stroke': 'black',
              'fill': 'none',
              'shape-rendering': 'crispEdges'
            }
          },
          class: Object.assign({}, d.class)
        }
      })
    }
  },
  render (h) {
    return h('svg', this.paths.map(path => h(AnimatedLine, path)))
  }
}
