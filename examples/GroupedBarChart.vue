<template>
  <g class="vg-chart vg-grouped-bar-chart" v-animated:transform="transform">
    <x-gridlines
      :interval="xDivider"
      :x-scale="xScale"
      :y-scale="yScale"
      :animation="scaleAnimation">
    </x-gridlines>
    <x-axis
      :interval="xLabel"
      :x-scale="xScale"
      :y-scale="yScale"
      :animation="scaleAnimation"
      :post-transform="transform"
      :tick-size="0"
      :tick-padding="20"
      :rotate="horizontal ? 90 : 0"
      anchor="top">
    </x-axis>
    <grouped-bar-plot
      ref="bars"
      :data-view="dataView"
      :x-scale="xScale"
      :y-scale="yScale"
      :g-scale="gScale"
      :animation-stagger="0.05"
      v-bind="$attrs"
      v-on="$listeners">
    </grouped-bar-plot>
  </g>
</template>

<script>
import GroupedBarPlot from '../components/GroupedBarPlot.vue'
import XGridlines from '../components/XGridlines.js'
import XAxis from '../components/XAxis.vue'
import Animated from '../animation/directives/v-animated.js'
import {makeAnimated} from '../animation'
import {dataViewMixin, userSpaceMixin} from '../mixins'
import {DomainHelper, IntervalHelper, TransformHelper} from '../helpers'
import {scaleBand, scaleLinear} from 'd3-scale'

function interpolateScale (from, to) {
  const fromRange = from.range()
  const toRange = to.range()
  return t => {
    const iRange = toRange.map((v, i) => (1 - t) * fromRange[i] + t * v)
    return to.copy().range(iRange)
  }
}

export default {
  name: 'GroupedBarChart',
  components: {
    GroupedBarPlot,
    XGridlines: makeAnimated(XGridlines, ['xScale', 'yScale']),
    XAxis: makeAnimated(XAxis, ['xScale', 'yScale'])
  },
  directives: {Animated},
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
      type: [Function, String, Number]
    },
    xDomain: {
      type: [Function, Array],
      default: DomainHelper.UNIQUE('x')
    },
    yDomain: {
      type: [Function, Array],
      default: DomainHelper.CLAMPED_MINMAX('y', 0)
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
    },
    groupPadding: {
      type: Number,
      default: 0.1
    }
  },
  computed: {
    layout () {
      const t = new TransformHelper()
      return this.horizontal ? t.invert() : t.flipY()
    },
    originAt () {
      return 'xMidYMid'
    },
    xScale () {
      return scaleBand()
        .domain(this.domain.x)
        .rangeRound(this.xRange)
        .paddingInner(this.groupPadding)
        .paddingOuter(this.groupPadding / 2)
    },
    yScale () {
      return scaleLinear()
        .domain(this.domain.y)
        .rangeRound(this.yRange)
    },
    gScale () {
      return scaleBand()
        .domain(this.domain.g)
        .paddingInner(this.padding)
        .paddingOuter(this.padding / 2)
        .round(true)
    },
    scaleAnimation () {
      return {
        interpolate: {
          xScale: interpolateScale,
          yScale: interpolateScale
        }
      }
    }
  },
  methods: {
    xDivider: IntervalHelper.BETWEEN(true),
    xLabel: IntervalHelper.MIDDLE()
  },
  watch: {
    transform () {
      this.$refs.bars.$children[0].animate()
    }
  }
}
</script>
