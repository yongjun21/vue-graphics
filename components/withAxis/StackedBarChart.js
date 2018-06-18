import StackedBarChart from '../StackedBarChart'
import LinearAxis from '../LinearAxis'
import GridLines from '../GridLines'

import {getInstanceProperties} from '../../util'

export default {
  extends: StackedBarChart,
  components: {
    'grid-lines': GridLines,
    'axis-component': LinearAxis
  },
  props: {
    xLabel: String,
    yLabel: String,
    tickCount: {
      type: Number,
      default: 10
    },
    gridlines: null
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
          tickLabel: data => h('text', data, this.data[data.id].label || data.id)
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

    const instanceProperties = getInstanceProperties(this)

    const $children = []
    Object.keys(this.$slots).forEach(key => {
      $children.push(this.$slots[key])
    })
    Object.keys(this.$scopedSlots).forEach(key => {
      $children.push(this.$scopedSlots[key](instanceProperties))
    })

    return h('svg', {class: 'vg-chart vg-stacked-bar-chart'}, [
      $gridlines,
      h('g', {attrs: {transform}}, $bars),
      $axes,
      $children
    ])
  }
}
