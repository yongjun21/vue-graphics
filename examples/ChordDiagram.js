import {scalePoint} from 'd3-scale'
import {path} from 'd3-path'
import TimelineLite from 'gsap/TimelineLite'
import {mapRadialToCartesian} from '../util'

import RadialAxis from '../components/RadialAxis'

import MeasureText from '../directives/v-measure-text'

import Draw from '../animation/directives/v-draw'
import {queueAnimations, flushAnimations} from '../animation'

export default {
  name: 'ChordDiagram',
  directives: {MeasureText, Draw},
  props: ['data', 'domain', 'groups', 'exclude', 'width', 'height'],
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
      scale.range([-90, 270])
      scale.padding(0.5)
      scale.align(0)
      return scale
    },
    center () {
      return [Math.round(this.width / 2), Math.round(this.height / 2)]
    },
    radius () {
      return Math.min(this.width, this.height) * 0.5
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
            attrs: {
              d: p.toString(),
              'data-value': d[key]
            },
            directives: [{
              name: 'draw',
              value: {duration: 0.5},
              arg: this._uid
            }]
          })
        })
        return Object.assign(obj, {[d.id]: paths})
      }, {})
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
    getAxes (h) {
      const {aScale, center, radius, getLabel, getValue, selected} = this
      return Object.keys(this.groupedDomain).map((g, i) => {
        return h(RadialAxis, {
          key: g,
          class: 'axis',
          attrs: {'data-group': g},
          props: {
            label: g,
            anchor: center,
            radius: radius + 6,
            scale: aScale,
            domain: this.groupedDomain[g],
            extrapolate: g === '_' ? '' : null,
            tickLength: 0,
            labelPadding: 130
          },
          scopedSlots: {
            tickLabel: data => h('g', {
              class: {
                'source': data.id === selected,
                'tick-label': true
              }
            }, [
              h('circle', {
                attrs: {
                  r: 3,
                  cx: -3,
                  'data-value': getValue(data.id)
                }
              }),
              h('text', Object.assign(data, {
                on: {
                  click: () => {
                    this.$emit('change', data.id)
                    this.selected = data.id
                  }
                }
              }), getLabel(data.id))
            ]),
            axisLabel: ({text, textPath, props}) => {
              const underlineRadius = radius + 120
              const underline = path()
              underline.moveTo(underlineRadius, 0)
              underline.arc(0, 0, underlineRadius, 0, (props.maxA - props.minA) * Math.PI / 180)
              return h('g', {class: 'axis-label'}, [
                h('path', {
                  attrs: {
                    d: underline.toString(),
                    transform: `rotate(${props.minA})`,
                    fill: 'none'
                  }
                }),
                h('text', text, [h('textPath', textPath, g)])
              ])
            }
          }
        })
      })
    },
    animate () {
      if (this.animation) this.animation.kill()
      queueAnimations(this._uid)
      this.$nextTick(function () {
        const tweens = flushAnimations(this._uid)
        if (tweens.length === 0) return
        this.animation = new TimelineLite({
          tweens,
          stagger: 0.0166667,
          onComplete: () => { this.animation = null }
        })
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

    const $axes = this.getAxes(h)
    const $lines = this.connections[this.selected].map(line => h('path', line))

    return h('svg', [
      h('g', {
        directives: [{
          name: 'measure-text',
          value: {
            target: '.tick-label text',
            callback: console.log
          }
        }]
      }, $axes),
      h('g', $lines)
    ])
  }
}
