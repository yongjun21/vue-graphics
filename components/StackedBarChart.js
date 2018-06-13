import {scaleBand, scaleLinear} from 'd3-scale'
import {stack} from 'd3-shape'

import Bar from '../elements/Bar'

import {mergeClass} from '../util'

export default {
  name: 'StackedBarChart',
  props: [
    'width',
    'height',
    'data',
    'domain',
    'range',
    'horizontal',
    'paddingInner',
    'paddingOuter'
  ],
  computed: {
    xScale () {
      const domain = this.data.map((d, i) => i)
      const range = this.horizontal == null ? [0, this.width] : [0, this.height]
      const scale = scaleBand()
      scale.domain(domain)
      scale.rangeRound(range)
      scale.paddingInner(this.paddingInner || 0)
      scale.paddingOuter(this.paddingOuter || 0)
      return scale
    },
    yScale () {
      const domain = this.range || this.stackedData.reduce((minmax, row) => {
        row.forEach(d => {
          if (d[0] < minmax[0]) minmax[0] = d[0]
          if (d[1] > minmax[1]) minmax[1] = d[1]
        })
        return minmax
      }, [0, 0])
      const range = this.horizontal == null ? [this.height, 0] : [0, this.width]
      const scale = scaleLinear()
      scale.domain(domain).nice()
      scale.rangeRound(range)
      return scale
    },
    domain_ () {
      return this.domain.map((d, i) => typeof d === 'object' ? d : {value: d})
    },
    stackedData () {
      const keys = this.domain_.map(d => d.value)
      return stack().keys(keys)(this.data)
    },
    bars () {
      const {xScale, yScale, domain_, data} = this

      const collection = []

      this.stackedData.forEach((row, j) => {
        row.forEach(([v1, v2], i) => {
          const y1 = yScale(v1)
          const y2 = yScale(v2)
          const label = data[i].label || i
          const group = domain_[j].label || domain_[j].value

          const attrs = {
            width: xScale.bandwidth(),
            height: Math.abs(y2 - y1),
            x: xScale(i),
            y: Math.min(y2, y1),
            'data-label': label,
            'data-group': group
          }

          collection.push({
            key: label + '__' + group,
            attrs,
            class: mergeClass(data[i].class, domain_[j].class),
            style: mergeClass(data[i].style, domain_[j].style)
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
    if (this.width == null || this.height == null) return h('svg')
    const transform = this.horizontal != null && 'matrix(0, 1, 1, 0, 0, 0)'
    const $bars = this.bars.map(bar => h('bar-element', bar))
    return h('svg', {class: 'vg-chart vg-stacked-bar-chart'}, [
      h('g', {attrs: {transform}}, $bars)
    ])
  }
}
