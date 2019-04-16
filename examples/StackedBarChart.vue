<template>
  <g class="vg-chart vg-stacked-bar-chart" :transform="transform">
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
import XAxis from '../components/XAxis.vue'
import YAxis from '../components/YAxis.vue'
import {dataViewMixin, userSpaceMixin} from '../mixins'
import {IntervalHelper, TransformHelper, DomainHelper} from '../helpers'
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
    xDomain: {
      type: [Function, Array],
      default: DomainHelper.UNIQUE('x')
    },
    yDomain: {
      type: [Function, Array],
      default: DomainHelper.STACKED_MINMAX('y', 'x')
    },
    gDomain: {
      type: [Function, Array],
      default: DomainHelper.UNIQUE('g')
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
