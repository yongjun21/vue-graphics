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
      return [Math.round(this.width / 2), Math.round(this.height / 2)]
    },
    radius () {
      return Math.min(this.width, this.height) * (0.5 - (this.padding || 0.2))
    },
    points () {
      const {aScale, center, radius} = this
      return this.sortedDomain.reduce((obj, key) => {
        const a = aScale(key)
        return Object.assign(obj, {[key]: mapRadialToCartesian(a, radius, center)})
      }, {})
    },
    connections () {
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
            attrs: {'data-value': d[key]},
            props: {
              d: p.toString(),
              auto: false
            }
          })
        })
        return Object.assign(obj, {[d.id]: paths})
      }, {})
    },
    axes () {
      const {aScale, center, radius} = this
      return Object.keys(this.groupedDomain).map((g, i) => {
        return {
          key: g,
          class: 'axis',
          attrs: {'data-group': g},
          props: {
            label: g,
            center: center,
            radius: radius + 6,
            scale: aScale,
            domain: this.groupedDomain[g],
            extrapolate: g === '_' ? '' : null,
            tickLength: 0,
            labelPadding: 130
          },
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
    selected: {
      handler: 'animate',
      immediate: true
    }
  },
  render (h) {
    if (this.width == null || this.height == null) return h('svg')
    const {selected, getLabel, getValue, radius} = this

    const lines = this.connections[selected] || []
    const $lines = lines.map(line => h(AnimatedLine, line))

    const $axes = this.axes.map(axis => {
      axis.scopedSlots.tickLabel = data => {
        const attrs = data.attrs
        return h('g', {
          key: data.key,
          class: {
            'source': data.key === selected,
            'tick-label': true
          }
        }, [
          h('circle', {
            attrs: {
              r: 3,
              cx: attrs.x >= 0 ? attrs.x - 6 : attrs.x + 6,
              transform: attrs.transform,
              'data-value': getValue(data.key)
            }
          }),
          h('text', {
            attrs: data.attrs,
            on: {
              click: () => {
                this.$emit('change', data.key)
                this.selected = data.key
              }
            }
          }, getLabel(data.key))
        ])
      }
      axis.scopedSlots.axisLabel = ({text, textPath, props}) => {
        const underlineRadius = radius + 120
        const underline = path()
        underline.moveTo(underlineRadius, 0)
        underline.arc(0, 0, underlineRadius, 0, props.maxA - props.minA)
        return h('g', {class: 'axis-label'}, [
          h('path', {
            attrs: {
              d: underline.toString(),
              transform: `rotate(${props.minA * 180 / Math.PI})`,
              fill: 'none'
            }
          }),
          h('text', text, [h('textPath', textPath, axis.key)])
        ])
      }
      return h(RadialAxis, axis)
    })

    return h('svg', [
      h('g', $axes),
      h('g', $lines)
    ])
  }
}
