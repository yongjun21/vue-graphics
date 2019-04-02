<template>
  <g class="vg-chart vg-bar-chart" :transform="transform.toString()">
    <bar-plot
      :data-view="dataView"
      :domain="domain"
      :x-scale="xScale"
      :y-scale="yScale"
      v-bind="$attrs"
      v-on="$listeners">
    </bar-plot>
  </g>
</template>

<script>
import BarPlot from '../components/BarPlot.vue'
import {dataViewMixin, userSpaceMixin} from '../mixins'
import {DomainHelper, RangeHelper, TransformHelper} from '../helpers'

export default {
  name: 'BarChart',
  components: {BarPlot},
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
    transform () {
      const t = new TransformHelper()
      return this.horizontal ? t.invert() : t.flipY()
    },
    xRange: RangeHelper.DISCRETE('x'),
    yRange: RangeHelper.CONTINUOUS('y')
  }
}
</script>
