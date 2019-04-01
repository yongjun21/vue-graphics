<template>
  <g class="vg-chart vg-grouped-bar-chart" :transform="transform.toString()">
    <x-gridlines
      :x-interval="xInterval"
      :y-range="yRange"
      :x-scale="xScale"
      :y-scale="yScale">
    </x-gridlines>
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
import {dataViewMixin, userSpaceMixin} from '../mixins'
import {DomainHelper, RangeHelper, IntervalHelper, TransformHelper} from '../helpers'

export default {
  name: 'GroupedBarChart',
  components: {GroupedBarPlot, XGridlines},
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
      type: [Array, Function],
      default: () => DomainHelper.UNIQUE('x')
    },
    yDomain: {
      type: [Array, Function],
      default: () => DomainHelper.CLAMPED_MINMAX('y', 0)
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
    xInterval: IntervalHelper.DIVIDER('x')
  }
}
</script>
