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
    'paddingInner',
    'paddingOuter'
  ],
  computed: {
    xScale () {
      const scale = scaleBand()
      scale.domain(this.data.map((d, i) => i))
      scale.rangeRound([0, this.width])
      scale.paddingInner(this.paddingInner || 0)
      scale.paddingOuter(this.paddingOuter || 0)
      return scale
    },
    yScale () {
      let domain = this.range
      if (!domain) {
        let min = this.baseline || 0
        let max = this.baseline || 0
        this.data_.forEach(d => {
          if (d.value < min) min = d.value
          if (d.value > max) max = d.value
        })
        domain = [min, max]
      }
      const scale = scaleLinear()
      scale.domain(domain).nice()
      scale.rangeRound([this.height, 0])
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
      const {xScale, yScale, horizontal} = this
      const yBaseline = yScale(this.baseline || 0)
      return this.data_.map((d, i) => {
        const y = yScale(d.value)
        const attrs = horizontal == null ? {
          width: xScale.bandwidth(),
          height: Math.abs(y - yBaseline),
          x: xScale(i),
          y: Math.min(yBaseline, y)
        } : {
          width: y,
          height: xScale.bandwidth(),
          x: 0,
          y: xScale(i)
        }
        attrs['data-label'] = d.label

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
    return h('svg', this.bars.map(bar => h('bar-element', bar)))
  }
}
