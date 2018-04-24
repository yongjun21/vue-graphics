import {scalePoint} from 'd3-scale'
import {path} from 'd3-path'
import {mapRadialToCartesian} from '../util'

import RadialAxis from './RadialAxis'
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
        return Object.assign(obj, {[key]: mapRadialToCartesian(a, radius, center)})
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
    },
    labelFormatter () {
      const labels = this.data.reduce((obj, d) => {
        return Object.assign(obj, {[d.id]: d.label})
      }, {})
      return key => labels[key]
    }
  },
  methods: {
    select (key) {
      this.selected = key
    }
  },
  render (h) {
    const lines = this.connections[this.selected] || []
    const $lines = lines.filter(line => line.attrs['data-value'] > 0)
                        .map(line => h(AnimatedLine, line))
    return h('svg', this.center && [
      h(RadialAxis, {
        props: {
          center: this.center,
          radius: this.radius,
          scale: this.aScale,
          domain: this.domain,
          formatter: this.labelFormatter
        },
        on: {
          click: this.select
        }
      }),
      h('g', $lines)
    ])
  }
}
