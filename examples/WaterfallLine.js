import {scalePoint, scaleLinear} from 'd3-scale'
import {line, curveStep} from 'd3-shape'

import Line from '../elements/Line'
import AnimatedLine from '../elements/AnimatedLine'
import EnlargeTarget from '../directives/v-enlarge-target'

export default {
  directives: {EnlargeTarget},
  props: ['data', 'domain', 'width', 'height'],
  data () {
    return {
      highlighted: {}
    }
  },
  computed: {
    xScale () {
      const scale = scalePoint()
      scale.domain(this.domain)
      scale.rangeRound(this.width && [0, this.width])
      scale.padding(0.5)
      return scale
    },
    yScale () {
      const scale = scaleLinear()
      scale.domain([-0.01, 1.01])
      scale.rangeRound(this.height && [this.height, 0])
      return scale
    },
    pathString () {
      if (this.width == null || this.height == null) return {}
      const {domain, width, xScale, yScale} = this
      const padding = xScale.step() / 2
      const lineGenerator = line().curve(curveStep)
      return this.data.reduce((obj, d) => {
        let cumulative = 0
        const points = []
        points.push([-padding, yScale(cumulative)])
        domain.forEach(key => {
          points.push([
            xScale(key),
            yScale(cumulative += d[key])
          ])
        })
        points.push([width + padding, yScale(cumulative)])
        return Object.assign(obj, {[d.id]: lineGenerator(points)})
      }, {})
    }
  },
  methods: {
    getHighlighter (d, highlight) {
      return () => {
        if (highlight == null) {
          highlight = this.highlighted[d.id]
        }
        this.$set(this.highlighted, d.id, highlight)
      }
    }
  },
  render (h) {
    const {pathString, highlighted} = this
    const $overlay = []
    const $content = this.data.filter(d => d.id in pathString).map(d => {
      if (highlighted[d.id]) {
        $overlay.push(h(AnimatedLine, {
          attrs: {
            d: pathString[d.id]
          },
          class: d.highlight && d.highlight.class,
          style: d.highlight && d.highlight.style
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
          // click: this.getHighlighter(d),
          mouseover: this.getHighlighter(d, true),
          mouseout: this.getHighlighter(d, false)
        },
        directives: [{name: 'enlarge-target'}]
      })
    })
    $content.push(h('g', $overlay))
    return h('svg', $content)
  }
}
