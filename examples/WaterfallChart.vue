<template>
  <g class="waterfall-chart" :transform="transform">
    <line-plot
      :data-view="dataView"
      :g-domain="domain.g"
      :x-scale="xScale"
      :y-scale="yScale"
      :curve="curve"
      :classed="g => ({overall: g === '__OVERALL__'})"
      @mouseover="select"
      @mouseout="deselect">
    </line-plot>
    <animated-line-plot
      class="overlay"
      :data-view="dataView.filter(d => selected[d.g])"
      :g-domain="domain.g"
      :x-scale="xScale"
      :y-scale="yScale"
      :curve="curve">
    </animated-line-plot>
  </g>
</template>

<script>
import LinePlot from '../components/LinePlot.vue'
import AnimatedLinePlot from '../components/AnimatedLinePlot.vue'
import {dataViewMixin, userSpaceMixin} from '../mixins'
import {DomainHelper, TransformHelper} from '../helpers'
import {scalePoint, scaleLinear} from 'd3-scale'
import {curveStepBefore} from 'd3-shape'

export default {
  name: 'WaterfallChart',
  mixins: [dataViewMixin, userSpaceMixin],
  components: {LinePlot, AnimatedLinePlot},
  data () {
    return {
      selected: {}
    }
  },
  computed: {
    layout () {
      return new TransformHelper().flipY()
    },
    xScale () {
      return scalePoint()
        .domain(this.domain.x)
        .rangeRound(this.xRange)
        .padding(0)
    },
    yScale () {
      return scaleLinear()
        .domain(this.domain.y)
        .rangeRound(this.yRange)
    }
  },
  methods: {
    x: d => d.x,
    y: d => d.y,
    g: d => d.g,
    xDomain: DomainHelper.UNIQUE('x'),
    yDomain: DomainHelper.MINMAX('y'),
    gDomain: DomainHelper.UNIQUE('g'),
    curve: curveStepBefore,
    select (e) {
      this.$set(this.selected, e.label, true)
    },
    deselect (e) {
      this.$set(this.selected, e.label, false)
    }
  }
}
</script>
