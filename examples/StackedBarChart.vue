<template>
  <g class="vg-chart vg-stacked-bar-chart" :transform="transform.toString()">
    <y-gridlines
      :y-interval="yInterval"
      :x-range="xRange"
      :x-scale="xScale"
      :y-scale="yScale">
    </y-gridlines>
    <x-axis
      :x-interval="xInterval"
      :x-scale="xScale"
      :y-scale="yScale"
      :post-transform="transform"
      :dx="-20"
      :tick-length="10">
    </x-axis>
    <y-axis
      :y-interval="yInterval"
      :x-anchor="xRange[1]"
      :y-range="yRange"
      :x-scale="xScale"
      :y-scale="yScale"
      :post-transform="transform"
      :dy="20">
    </y-axis>
    <stacked-bar-plot
      :data-view="dataView"
      :domain="domain"
      :x-scale="xScale"
      :y-scale="yScale"
      v-bind="$attrs"
      v-on="$listeners">
    </stacked-bar-plot>
  </g>
</template>

<script>
import StackedBarPlot from '../components/StackedBarPlot.vue'
import YGridlines from '../components/YGridlines.js'
import XAxis from '../components/XAxis.js'
import YAxis from '../components/YAxis.js'
import {dataViewMixin, userSpaceMixin} from '../mixins'
import {RangeHelper, IntervalHelper, TransformHelper, SplitApplyCombine} from '../helpers'

export default {
  name: 'StackedBarChart',
  components: {StackedBarPlot, YGridlines, XAxis, YAxis},
  mixins: [dataViewMixin, userSpaceMixin],
  inheritAttrs: false,
  props: {
    x: {
      type: [Function, String, Number],
      required: true
    },
    y: {
      type: [Function, String, Number],
      required: true
    },
    g: {
      type: [Function, String, Number],
      required: true
    },
    yDomain: {
      type: [Array, Function],
      default: () => {
        return data => {
          const stacked = SplitApplyCombine(data)
            .split('x')
            .split('g')
            .apply((members, group) => {
              const values = members.map(d => d.y)
              group.minY = values.reduce((min, v) => v < min ? v : min, 0)
              group.maxY = values.reduce((max, v) => v > max ? v : max, 0)
            })
            .combine()
            .split('x')
            .apply((members, group) => {
              const plus = members.map(d => d.maxY)
              const minus = members.map(d => d.minY)
              group.stackedYPlus = plus.reduce((sum, v) => sum + v)
              group.stackedYMinus = minus.reduce((sum, v) => sum + v)
            })
            .combine()
          return [
            stacked.reduce((min, v) => v.stackedYMinus < min ? v.stackedYMinus : min, 0),
            stacked.reduce((max, v) => v.stackedYPlus > max ? v.stackedYPlus : max, 0)
          ]
        }
      }
    },
    horizontal: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    transform () {
      const t = new TransformHelper()
      return this.horizontal ? t.invert() : t.flipY()
    },
    xRange: RangeHelper.DISCRETE('x'),
    yRange: RangeHelper.CONTINUOUS('y'),
    xInterval: IntervalHelper.MIDDLE('x'),
    yInterval: IntervalHelper.NICE('y')
  }
}
</script>
