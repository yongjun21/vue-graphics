import AnimatedBar from './chart-elements/AnimatedBar'
import {scaleBand, scaleLinear} from 'd3-scale'

export default {
  props: ['data', 'sized', 'width', 'height'],
  data () {
    return {
      paddingInner: 0.2,
      paddingOuter: 1,
      maxValue: 80
    }
  },
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
      scale.domain([0, this.maxValue])
      scale.range(this.height && [0, this.height])
      return scale
    },
    bars () {
      if (!this.sized) return []
      const {height, xScale, yScale} = this
      return this.data.map((d, i) => {
        const h = yScale(d)
        return {
          key: i,
          props: {
            attrs: {
              width: xScale.bandwidth(),
              height: h,
              x: xScale(i),
              y: height - h
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
