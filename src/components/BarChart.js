import {scaleBand, scaleLinear} from 'd3-scale'

// import Bar from '../elements/Bar'
import AnimatedBar from '../elements/AnimatedBar'

export default {
  name: 'BarChart',
  props: ['data', 'domain', 'width', 'height', 'paddingInner', 'paddingOuter'],
  computed: {
    xScale () {
      const scale = scaleBand()
      scale.domain(this.data.map((d, i) => i))
      scale.range(this.width && [0, this.width])
      scale.paddingInner(this.paddingInner)
      scale.paddingOuter(this.paddingOuter)
      return scale
    },
    yScale () {
      const scale = scaleLinear()
      scale.domain(this.domain)
      scale.range(this.height && [0, this.height])
      return scale
    },
    bars () {
      if (this.width == null || this.height == null) return []
      const {height, xScale, yScale} = this
      return this.data.map((d, i) => {
        const h = yScale(d.value)
        return {
          key: d.label || i,
          props: {
            class: d.class,
            style: d.style,
            attrs: {
              width: xScale.bandwidth(),
              height: h,
              x: xScale(i),
              y: height - h,
              stroke: 'none'
            }
          }
        }
      })
    }
  },
  render (h) {
    return h('svg', this.bars.map(bar => h(AnimatedBar, bar)))
  }
}
