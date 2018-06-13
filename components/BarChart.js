import {scaleBand, scaleLinear} from 'd3-scale'

import Bar from '../elements/Bar'

export default {
  name: 'BarChart',
  props: [
    'width',
    'height',
    'data',
    'range',
    'baseline',
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
      const domain = this.range || this.data_.reduce((minmax, d) => {
        if (d.value < minmax[0]) minmax[0] = d.value
        if (d.value > minmax[1]) minmax[1] = d.value
        return minmax
      }, [this.baseline || 0, this.baseline || 0])
      const range = this.horizontal == null ? [this.height, 0] : [0, this.width]
      const scale = scaleLinear()
      scale.domain(domain).nice()
      scale.rangeRound(range)
      return scale
    },
    data_ () {
      return this.data.map((d, i) => {
        const _d = typeof d === 'object' ? d : {value: d}
        _d.label = _d.label || i
        return _d
      })
    },
    bars () {
      const {xScale, yScale} = this
      const yBaseline = yScale(this.baseline || 0)
      return this.data_.map((d, i) => {
        const y = yScale(d.value)
        const attrs = {
          width: xScale.bandwidth(),
          height: Math.abs(y - yBaseline),
          x: xScale(i),
          y: Math.min(y, yBaseline),
          'data-label': d.label
        }
        return {
          key: d.label,
          class: d.class,
          style: d.style,
          attrs
        }
      })
    }
  },
  components: {
    'bar-element': Bar
  },
  render (h) {
    if (this.width == null || this.height == null) return h('svg')
    const transform = this.horizontal != null && 'matrix(0, 1, 1, 0, 0, 0)'
    const $bars = this.bars.map(bar => h('bar-element', bar))
    return h('svg', {class: 'vg-chart vg-bar-chart'}, [
      h('g', {attrs: {transform}}, $bars)
    ])
  }
}
