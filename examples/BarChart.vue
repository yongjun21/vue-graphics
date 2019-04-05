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
import {DomainHelper, TransformHelper} from '../helpers'
import {scaleBand, scaleLinear} from 'd3-scale'

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
  }
}
</script>
