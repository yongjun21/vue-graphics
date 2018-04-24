import {scaleBand, scaleLinear} from 'd3-scale'

import Bar from '../elements/Bar'
// import AnimatedBar from '../elements/AnimatedBar'

export default {
  name: 'BarChart',
  props: ['data', 'domain', 'width', 'height', 'paddingInner', 'paddingOuter'],
  computed: {
    xScale () {
      const scale = scaleBand()
      scale.domain(this.data.map((d, i) => i))
      scale.rangeRound(this.width && [0, this.width])
      scale.paddingInner(this.paddingInner || 0)
      scale.paddingOuter(this.paddingOuter || 0)
      return scale
    },
    yScale () {
      const scale = scaleLinear()
      scale.domain(this.domain)
      scale.rangeRound(this.height && [0, this.height])
      return scale
    },
    bars () {
      if (this.width == null || this.height == null) return []
      const {height, xScale, yScale} = this
      return this.data.map((d, i) => {
        let label = i
        let value = d
        if (typeof d === 'object') {
          label = d.label || i
          value = d.value
        }
        const h = yScale(value)
        return {
          key: label,
          class: d.class,
          style: d.style,
          attrs: {
            width: xScale.bandwidth(),
            height: h,
            x: xScale(i),
            y: Math.round(height - h),
            stroke: 'none'
          }
        }
      })
    }
  },
  render (h) {
    return h('svg', this.bars.map(bar => h(Bar, bar)))
  }
}
