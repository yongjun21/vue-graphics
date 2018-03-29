import AnimatedBar from './chart-elements/AnimatedBar'
import responsiveMixin from '../mixins/responsiveMixin'

export default {
  props: ['data'],
  data () {
    return {
      barWidth: 50,
      barGap: 10,
      maxValue: 80
    }
  },
  computed: {
    bars () {
      const {height, barWidth, barGap, maxValue} = this
      if (!this.sized) return []
      return this.data.map((d, i) => {
        const h = d / maxValue * height
        return {
          key: i,
          props: {
            attrs: {
              width: barWidth,
              height: h,
              x: barGap + i * (barWidth + barGap),
              y: height - h
            }
          }
        }
      })
    }
  },
  mixins: [responsiveMixin],
  render (h) {
    return h('svg', this.bars.map(bar => h(AnimatedBar, bar)))
  }
}
