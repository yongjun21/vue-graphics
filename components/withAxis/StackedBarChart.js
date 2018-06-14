import StackedBarChart from '../StackedBarChart'
import LinearAxis from '../LinearAxis'
import GridLines from '../GridLines'

export default {
  name: 'StackedBarChart',
  extends: StackedBarChart,
  props: {
    xLabel: String,
    yLabel: String,
    tickCount: {
      type: Number,
      default: 10
    },
    gridlines: null
  },
  components: {
    'grid-lines': GridLines,
    'axis-component': LinearAxis
  },
  render (h) {
    if (this.width == null || this.height == null) return h('svg')

    const transform = this.horizontal != null && 'matrix(0, 1, 1, 0, 0, 0)'
    const $bars = this.bars.map(bar => h('bar-element', bar))

    const $gridlines = this.gridlines != null && h('grid-lines', {
      props: {
        scale: this.yScale,
        domain: this.yScale.ticks(this.tickCount),
        extent: this.horizontal == null ? [0, this.width] : [0, this.height],
        horizontal: this.horizontal != null || null
      }
    })

    const anchor = this.horizontal == null
                 ? [0, this.yScale(0)]
                 : [this.yScale(0), this.height]
    const $axes = [
      h('axis-component', {
        props: {
          placement: this.horizontal == null ? 'bottom' : 'left',
          anchor,
          scale: this.xScale,
          domain: this.xScale.domain(),
          extrapolate: true,
          label: this.xLabel
        },
        scopedSlots: {
          tickLabel: data => h('text', data, this.data[data.id].label || data.key)
        }
      }),
      h('axis-component', {
        props: {
          placement: this.horizontal == null ? 'left' : 'bottom',
          anchor,
          scale: this.yScale,
          domain: this.yScale.ticks(this.tickCount),
          extrapolate: true,
          label: this.yLabel
        }
      })
    ]

    const $children = this.$scopedSlots.default && this.$scopedSlots.default(this)

    return h('svg', {class: 'vg-chart vg-stacked-bar-chart'}, [
      $gridlines,
      h('g', {attrs: {transform}}, $bars),
      $axes,
      $children
    ])
  }
}
