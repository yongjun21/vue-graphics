import {scaleBand, scaleLinear} from 'd3-scale'

import Bar from '../elements/Bar'
import boxLayout from '../mixins/boxLayout'

export default {
  name: 'BarChart',
  extends: boxLayout,
  props: ['data', 'yDomain', 'paddingInner', 'paddingOuter'],
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
      const scale = scaleLinear()
      scale.domain(this.yDomain)
      scale.rangeRound(this.yRange)
      return scale
    },
    bars () {
      if (this.width == null || this.height == null) return []

      const {xScale, yScale, horizontal} = this
      const yMax = yScale.range()[1]

      return this.data.map((d, i) => {
        let label = i
        let value = d
        if (typeof d === 'object') {
          label = d.label || i
          value = d.value
        }
        const y = yScale(value)

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
        attrs['data-label'] = label

        return {
          key: label,
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
