import {scaleBand, scaleLinear} from 'd3-scale'
import {stack} from 'd3-shape'

import Bar from '../elements/Bar'

import {mergeClass} from '../util'

export default {
  name: 'StackedBarChart',
  props: ['data', 'domain', 'yDomain', 'width', 'height', 'paddingInner', 'paddingOuter', 'horizontal'],
  computed: {
    xRange () {
      return Math.round(this.horizontal == null ? this.width : this.height)
    },
    yRange () {
      return Math.round(this.horizontal == null ? this.height : this.width)
    },
    xScale () {
      const scale = scaleBand()
      scale.domain(this.data.map((d, i) => i))
      scale.rangeRound(this.xRange && [0, this.xRange])
      scale.paddingInner(this.paddingInner || 0)
      scale.paddingOuter(this.paddingOuter || 0)
      return scale
    },
    yScale () {
      const scale = scaleLinear()
      scale.domain(this.yDomain)
      scale.rangeRound(this.yRange && [0, this.yRange])
      return scale
    },
    stackedData () {
      const keys = this.domain.map(d => typeof d === 'object' ? d.value : d)
      return stack().keys(keys)(this.data)
    },
    bars () {
      if (this.width == null || this.height == null) return []

      const {yRange, xScale, yScale, horizontal, domain, data} = this

      const collection = []

      this.stackedData.forEach((row, j) => {
        row.forEach(([v1, v2], i) => {
          const y1 = yScale(v1)
          const y2 = yScale(v2)
          const attrs = horizontal ? {
            width: xScale.bandwidth(),
            height: y2 - y1,
            x: xScale(i),
            y: yRange - y2
          } : {
            width: y2 - y1,
            height: xScale.bandwidth(),
            x: y1,
            y: xScale(i)
          }
          const xLabel = data[i].label || i
          const yLabel = (typeof domain[j] === 'object' && domain[j].label) || j
          attrs['data-x-label'] = xLabel
          attrs['data-y-label'] = yLabel
          collection.push({
            key: xLabel + '__' + yLabel,
            attrs,
            class: mergeClass(data[i].class, typeof domain[j] === 'object' && domain[j].class)
          })
        })
      })

      return collection
    }
  },
  components: {
    'bar-element': Bar
  },
  render (h) {
    return h('svg', this.bars.map(bar => h('bar-element', bar)))
  }
}
