<template>
  <g class="vg-chart vg-bar-chart" :transform="transform">
    <bar-plot
      :data-view="dataView"
      :x-scale="xScale"
      :y-scale="yScale"
      v-bind="$attrs"
      v-on="$listeners">
      <template v-slot="{getGeom, hasGeom}">
        <animated-annotations
          :data-view="dataView"
          :get-geom="getGeom"
          :has-geom="hasGeom"
          :x="g => g.x + 0.5 * g.width"
          :y="g => g.height + 10"
          :v="d => d.y"
          :enter="{y: 10, value: 0}"
          :exit="{y: 10, value: 0}"
          anchor="bottom"
          :post-transform="transform"
          v-on="$listeners">
        </animated-annotations>
      </template>
    </bar-plot>
  </g>
</template>

<script>
import BarPlot from '../components/BarPlot.vue'
import AnimatedAnnotations from '../components/AnimatedAnnotations.vue'
import {dataViewMixin, userSpaceMixin} from '../mixins'
import {DomainHelper, TransformHelper} from '../helpers'
import {scaleBand, scaleLinear} from 'd3-scale'

export default {
  name: 'BarChart',
  components: {BarPlot, AnimatedAnnotations},
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
    xDomain: {
      type: [Function, Array],
      default: DomainHelper.UNIQUE('x')
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
