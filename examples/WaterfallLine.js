import {scalePoint, scaleLinear} from 'd3-scale'
import {line, curveStepBefore} from 'd3-shape'

import Line from '../elements/Line'
import AnimatedLine from '../elements/AnimatedLine'
import EnlargeTarget from '../directives/v-enlarge-target'

import {mergeClass} from '../util'

const lineGenerator = line().curve(curveStepBefore)

export default {
  name: 'WaterfallLine',
  components: {'highlighted-line': AnimatedLine},
  directives: {EnlargeTarget},
  props: ['data', 'domain', 'highlighted', 'interactives', 'width', 'height'],
  data () {
    return {
      selected: {}
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
    paths () {
      const {domain, xScale, yScale} = this
      const halfStep = xScale.step() / 2
      return this.data.map(d => {
        let cumulative = 0
        const points = []
        points.push([xScale(domain[0]) - halfStep, yScale(cumulative)])
        domain.forEach(key => {
          points.push([
            xScale(key) + halfStep,
            yScale(Math.min(cumulative += d[key], 1))
          ])
        })
        return points
      })
    },
    pathStrings () {
      return this.paths.map(lineGenerator)
    }
  },
  methods: {
    handlerGenerator (id, bool) {
      return () => {
        if (bool == null) bool = !this.selected[id]
        this.$set(this.selected, id, bool)
        if (bool) this.$emit('select', id)
      }
    }
  },
  render (h) {
    if (this.width == null || this.height == null) return h('svg')

    const {pathStrings, highlighted, selected, interactives} = this
    const $overlay = []
    const $lines = this.data.map((d, i) => {
      if ((highlighted && highlighted.indexOf(d.id) > -1) || selected[d.id]) {
        $overlay.push(h('highlighted-line', {
          key: d.id,
          class: mergeClass(d.class, 'highlighted'),
          attrs: {
            d: pathStrings[i],
            'fill': 'none'
          }
        }))
      }
      return h(Line, {
        key: d.id,
        attrs: {
          d: pathStrings[i],
          'stroke': '#888',
          'fill': 'none'
        },
        class: d.class,
        style: d.style,
        on: interactives && interactives(this.handlerGenerator, d.id),
        directives: interactives && [{name: 'enlarge-target'}]
      })
    })
    return h('svg', {class: 'waterfall-line'}, [
      h('g', $lines),
      h('g', $overlay)
    ])
  }
}
