import {scaleBand, scaleLinear} from 'd3-scale'

import Bar from '../elements/Bar'
import boxLayout from '../mixins/boxLayout'

export default {
  name: 'BarChart',
  extends: boxLayout,
  props: ['data', 'range', 'horizontal', 'paddingInner', 'paddingOuter'],
  computed: {
    xScale () {
      const scale = scaleBand()
      scale.domain(this.data.map((d, i) => i))
      scale.rangeRound(this.xRange)
      scale.paddingInner(this.paddingInner || 0)
      scale.paddingOuter(this.paddingOuter || 0)
      return scale
    },
    yScale () {
      let domain = this.range
      if (!domain) {
        let min = 0
        let max = 0
        this.data_.forEach(d => {
          if (d.value < min) min = d.value
          if (d.value > max) max = d.value
        })
        domain = [min, max]
      }
      const scale = scaleLinear()
      scale.domain(domain).nice()
      scale.rangeRound(this.yRange)
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
      if (this.width == null || this.height == null) return []

      const {xScale, yScale, horizontal} = this
      const yMax = yScale.range()[1]

      return this.data_.map((d, i) => {
        const y = yScale(d.value)
        const attrs = horizontal == null ? {
          width: xScale.bandwidth(),
          height: y,
          x: xScale(i),
          y: yMax - y
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
    return h('svg', this.bars.map(bar => h('bar-element', bar)))
  }
}
