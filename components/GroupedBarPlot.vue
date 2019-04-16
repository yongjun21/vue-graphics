<template>
  <g class="vg-plot vg-bar-plot" v-on="wrappedListeners">
    <rect v-for="d in dataView" :key="d.key" v-if="hasGeom(d)"
      class="vg-bar"
      :class="d.class"
      v-associate="d"
      v-animated:[_uid]="getGeom(d)">
    </rect>
    <slot v-bind="{getGeom, hasGeom}"></slot>
  </g>
</template>

<script>
import {animationMixin, associateDataMixin} from '../mixins'
import {scaleBand} from 'd3-scale'

export default {
  name: 'GroupBarPlot',
  mixins: [animationMixin, associateDataMixin],
  inheritAttrs: false,
  props: {
    dataView: {
      type: Array,
      required: true
    },
    xScale: {
      type: Function,
      required: true
    },
    yScale: {
      type: Function,
      default: v => v
    },
    gScale: {
      type: Function,
      default: scaleBand().domain([undefined])
    }
  },
  computed: {
    subScales () {
      const {xScale, gScale} = this
      const scales = {}
      xScale.domain().forEach(x => {
        const start = xScale(x)
        const stop = start + xScale.bandwidth()
        scales[x] = gScale.copy().range([start, stop])
      })
      return scales
    }
  },
  methods: {
    getGeom (d) {
      const {yScale} = this
      const xScale = this.subScales[d.x]
      return {
        x: xScale(d.g),
        y: yScale(0),
        width: xScale.bandwidth(),
        height: yScale(d.y) - yScale(0),
        duration: 0.66667,
        order: d.index
      }
    },
    hasGeom (d) {
      return this.xScale(d.x) != null && this.yScale(d.y) != null && this.gScale(d.g) != null
    }
  }
}
</script>
