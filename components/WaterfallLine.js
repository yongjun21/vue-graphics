import {scalePoint, scaleLinear} from 'd3-scale'
import {path as d3Path} from 'd3-path'
import {line} from 'd3-shape'

import Line from '../elements/Line'
import AnimatedLine from '../elements/AnimatedLine'

export default {
  props: ['data', 'domain', 'width', 'height'],
  data () {
    return {
      baseColor: '#CCC',
      highlighted: {}
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
    pathString () {
      if (this.width == null || this.height == null) return {}
      const {domain, width, xScale, yScale} = this
      return this.data.reduce((obj, d) => {
        let cumulative = 0
        const p = d3Path()
        p.moveTo(0, yScale(cumulative))
        domain.forEach(point => {
          const x = xScale(point)
          p.lineTo(x, yScale(cumulative))
          cumulative += d[point]
          p.lineTo(x, yScale(cumulative))
        })
        p.lineTo(width, yScale(cumulative))

        return Object.assign(obj, {[d.id]: p.toString()})
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
          props: {
            attrs: {
              d: pathString[d.id]
            }
          },
          class: d.highlight && d.highlight.class,
          style: d.highlight && d.highlight.style
        }))
      }
      return h('g', {key: d.id}, [
        h('path', {
          attrs: {
            d: pathString[d.id],
            'stroke': 'none',
            'fill': 'none',
            'stroke-width': '9'
          },
          class: {clickable: true},
          on: {
            // click: this.getClickHandler(d),
            mouseover: this.getHighlighter(d, true),
            mouseout: this.getHighlighter(d, false)
          }
        }),
        h(Line, {
          props: {
            attrs: {
              d: pathString[d.id],
              fill: 'none'
            },
            class: d.class,
            style: d.style
          }
        })
      ])
    })
    $content.push(h('g', $overlay))
    return h('svg', $content)
  }
}
