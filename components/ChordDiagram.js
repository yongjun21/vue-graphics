import {scalePoint} from 'd3-scale'
import {path} from 'd3-path'

import AnimatedLine from '../elements/AnimatedLine'

export default {
  props: ['data', 'domain', 'width', 'height', 'padding'],
  data () {
    return {
      selected: 'SG'
    }
  },
  computed: {
    aScale () {
      const scale = scalePoint()
      scale.domain(this.domain)
      scale.range([-0.5 * Math.PI, 1.5 * Math.PI])
      scale.padding(0.5)
      scale.align(0)
      return scale
    },
    center () {
      if (this.width == null || this.height == null) return null
      return [Math.round(this.width / 2), Math.round(this.height / 2)]
    },
    radius () {
      if (this.center == null) return null
      return Math.min(this.width, this.height) * (0.5 - (this.padding || 0.1))
    },
    points () {
      if (this.center == null) return {}
      const {aScale, center, radius} = this
      return this.domain.reduce((obj, key) => {
        const a = aScale(key)
        const xy = [
          Math.round(Math.cos(a) * radius + center[0]),
          Math.round(Math.sin(a) * radius + center[1])
        ]
        return Object.assign(obj, {[key]: xy})
      }, {})
    },
    connections () {
      if (this.center == null) return {}
      const {points, domain, center} = this
      return this.data.reduce((obj, d) => {
        if (!points[d.id]) return obj
        const paths = []
        domain.forEach(key => {
          const p = path()
          p.moveTo(...points[d.id])
          p.quadraticCurveTo(...center, ...points[key])
          paths.push({
            props: {
              d: p.toString()
            },
            attrs: {
              'data-value': d[key]
            }
          })
        })
        return Object.assign(obj, {[d.id]: paths})
      }, {})
    }
  },
  render (h) {
    const lines = this.connections[this.selected] || []
    const filtered = lines.filter(line => line.attrs['data-value'] > 0)
    return h('svg', filtered.map(line => h(AnimatedLine, line)))
  }
}