import StackedBarChart from '../StackedBarChart'
import LinearAxis from '../LinearAxis'

export default {
  name: 'StackedBarChart',
  extends: StackedBarChart,
  props: [
    'xLabel',
    'yLabel'
  ],
  render (h) {
    if (this.width == null || this.height == null) return h('svg')

    const transform = this.horizontal != null && 'matrix(0, 1, 1, 0, 0, 0)'
    const $bars = this.bars.map(bar => h('bar-element', bar))

    const $axes = [
      h(LinearAxis, {
        props: {
          placement: this.horizontal == null ? 'bottom' : 'left',
          anchor: this.yScale(0),
          scale: this.xScale,
          domain: this.xScale.domain(),
          extrapolate: true,
          label: this.xLabel
        },
        scopedSlots: {
          tickLabel: data => h('text', data, this.data[data.id].label || data.key)
        }
      }),
      h(LinearAxis, {
        props: {
          placement: this.horizontal == null ? 'left' : 'bottom',
          anchor: this.horizontal != null ? this.height : 0,
          scale: this.yScale,
          domain: this.yScale.ticks(),
          extrapolate: true,
          label: this.yLabel
        }
      })
    ]

    const $slots = this.$scopedSlots.default && this.$scopedSlots.default(this)

    return h('svg', {class: 'vg-chart vg-stacked-bar-chart'}, [
      h('g', {attrs: {transform}}, $bars),
      $axes,
      $slots
    ])
  }
}
