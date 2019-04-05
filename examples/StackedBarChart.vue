<template>
  <g class="vg-chart vg-stacked-bar-chart" :transform="transform.toString()">
    <y-gridlines
      :interval="yInterval"
      :x-scale="xScale"
      :y-scale="yScale">
    </y-gridlines>
    <x-axis
      :interval="xInterval"
      :x-scale="xScale"
      :y-scale="yScale"
      :post-transform="transform"
      :tick-size="10"
      :tick-padding="10"
      anchor="right">
    </x-axis>
    <y-axis
      :interval="yInterval"
      :x-translate="xRange[1]"
      :y-scale="yScale"
      :post-transform="transform"
      :tick-size="0"
      :tick-padding="-3"
      anchor="top">
    </y-axis>
    <stacked-bar-plot
      :data-view="dataView"
      :x-scale="xScale"
      :y-scale="yScale"
      :g-domain="domain.g"
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
import {IntervalHelper, TransformHelper, SplitApplyCombine} from '../helpers'
import {scaleBand, scaleLinear} from 'd3-scale'

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
      type: [Function, Array],
      default: data => {
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
    },
    horizontal: {
      type: Boolean,
      default: false
    },
    padding: {
      type: Number,
      default: 0.1
    }
  },
  computed: {
    layout () {
      const t = new TransformHelper()
      return this.horizontal ? t.invert() : t.flipY()
    },
    xScale () {
      return scaleBand()
        .domain(this.domain.x)
        .rangeRound(this.xRange)
        .paddingInner(this.padding)
        .paddingOuter(this.padding / 2)
    },
    yScale () {
      return scaleLinear()
        .domain(this.domain.y)
        .rangeRound(this.yRange)
    }
  },
  methods: {
    xInterval: IntervalHelper.MIDDLE(),
    yInterval: IntervalHelper.TICKS()
  }
}
</script>
