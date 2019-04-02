<template>
  <g class="vg-chart vg-grouped-bar-chart" :transform="transform.toString()">
    <x-gridlines
      :x-interval="xInterval"
      :y-range="yRange"
      :x-scale="xScale"
      :y-scale="yScale">
    </x-gridlines>
    <x-axis
      :x-interval="xLabel"
      :x-scale="xScale"
      :y-scale="yScale"
      :post-transform="transform"
      :dx="-20"
      :rotate="90"
      anchor="top">
    </x-axis>
    <grouped-bar-plot
      :data-view="dataView"
      :domain="domain"
      :x-scale="xScale"
      :y-scale="yScale"
      v-bind="$attrs"
      v-on="$listeners">
    </grouped-bar-plot>
  </g>
</template>

<script>
import GroupedBarPlot from '../components/GroupedBarPlot.vue'
import XGridlines from '../components/XGridlines.js'
import XAxis from '../components/XAxis.js'
import {dataViewMixin, userSpaceMixin} from '../mixins'
import {DomainHelper, RangeHelper, IntervalHelper, TransformHelper} from '../helpers'

export default {
  name: 'GroupedBarChart',
  components: {GroupedBarPlot, XGridlines, XAxis},
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
      default: DomainHelper.CLAMPED_MINMAX('y', 0)
    },
    horizontal: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    layout () {
      const t = new TransformHelper()
      return this.horizontal ? t.invert() : t.flipY()
    },
    xRange: RangeHelper.DISCRETE('x'),
    yRange: RangeHelper.CONTINUOUS('y'),
    xInterval: IntervalHelper.DIVIDER('x'),
    xLabel: IntervalHelper.MIDDLE('x')
  }
}
</script>
