import {scalePoint} from 'd3-scale'
import {path} from 'd3-path'
import TimelineLite from 'gsap/TimelineLite'
import {mapRadialToCartesian} from '../util'

import RadialAxis from '../components/RadialAxis'
import AnimatedLine from '../elements/AnimatedLine'

export default {
  name: 'ChordDiagram',
  props: ['data', 'domain', 'groups', 'exclude', 'width', 'height', 'padding'],
  data () {
    return {
      selected: 'SG'
    }
  },
  computed: {
    groupedDomain () {
      const {domain} = this
      if (!this.groups) return {_: domain}
      return this.groups.reduce((obj, g) => {
        const subset = domain.filter(key => {
          return this.data.some(d => d.id === key && d.group === g)
        })
        return Object.assign(obj, {[g]: subset})
      }, {})
    },
    sortedDomain () {
      const groups = this.groups || ['_']
      return groups.reduce((arr, g) => arr.concat(this.groupedDomain[g]), [])
    },
    aScale () {
      const scale = scalePoint()
      scale.domain(this.sortedDomain)
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
      return this.sortedDomain.reduce((obj, key) => {
        const a = aScale(key)
        return Object.assign(obj, {[key]: mapRadialToCartesian(a, radius, center)})
      }, {})
    },
    connections () {
      if (this.center == null) return {}
      const {points, sortedDomain, groupedDomain, exclude, center} = this
      return this.data.reduce((obj, d) => {
        if (!points[d.id]) return obj

        const start = (groupedDomain[d.group] || sortedDomain)[0]
        const startIndex = sortedDomain.indexOf(start)
        const resorted = sortedDomain.slice(startIndex).concat(sortedDomain.slice(0, startIndex))

        const paths = []
        resorted.forEach(key => {
          if (exclude && exclude(d[key])) return
          const p = path()
          p.moveTo(...points[d.id])
          p.quadraticCurveTo(...center, ...points[key])
          paths.push({
            key,
            ref: key,
            attrs: {
              d: p.toString(),
              'data-value': d[key]
            },
            props: {
              auto: false
            }
          })
        })
        return Object.assign(obj, {[d.id]: paths})
      }, {})
    },
    axes () {
      if (this.center == null) return []
      const {aScale, center, radius} = this
      return Object.keys(this.groupedDomain).map(g => {
        return {
          attrs: {'data-group': g},
          props: {
            center: center,
            radius: radius,
            scale: aScale,
            domain: this.groupedDomain[g],
            innerPadding: 6,
            complete: g === '_' ? '' : null
          },
          class: 'axis',
          scopedSlots: {}
        }
      })
    },
    getLabel () {
      const labels = this.data.reduce((obj, d) => {
        return Object.assign(obj, {[d.id]: d.label})
      }, {})
      return key => labels[key]
    },
    getValue () {
      const {selected} = this
      const values = this.data.filter(d => d.id === selected)[0]
      return key => values[key]
    }
  },
  methods: {
    animate () {
      this.$nextTick(function () {
        const tweens = this.connections[this.selected]
          .map(line => this.$refs[line.key].animate())
        return new TimelineLite({tweens, stagger: 0.01})
      })
    }
  },
  watch: {
    connections: 'animate',
    selected: 'animate'
  },
  render (h) {
    if (!this.center) return h('svg')
    const {selected, getLabel, getValue} = this

    const lines = this.connections[selected] || []
    const $lines = lines.map(line => h(AnimatedLine, line))

    const $axes = this.axes.map(axis => {
      axis.scopedSlots.default = data => {
        if (data.key === selected) data.class = 'source'
        data.attrs['data-value'] = getValue(data.key)
        data.on = {
          click: () => {
            this.selected = data.key
          }
        }
        return h('text', data, getLabel(data.key))
      }
      return h(RadialAxis, axis)
    })

    return h('svg', [
      h('g', $axes),
      h('g', $lines)
    ])
  }
}
