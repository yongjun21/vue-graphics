<template>
  <g class="vg-plot vg-scatter-plot" v-on="wrappedListeners">
    <circle v-for="d in dataView" :key="d.key" v-if="hasGeom(d)"
      class="vg-dot"
      :class="d.class"
      v-associate="d"
      v-animated:[_uid]="getGeom(d)">
    </circle>
    <slot v-bind="{getGeom, hasGeom}"></slot>
  </g>
</template>

<script>
import {animationMixin, associateDataMixin} from '../mixins'

export default {
  name: 'ScatterPlot',
  mixins: [animationMixin, associateDataMixin],
  inheritAttrs: false,
  props: {
    dataView: {
      type: Array,
      required: true
    },
    xScale: {
      type: Function,
      default: v => v
    },
    yScale: {
      type: Function,
      default: v => v
    },
    dotSize: {
      type: Number,
      default: 8
    }
  },
  methods: {
    getGeom (d) {
      const {xScale, yScale, dotSize} = this
      return {
        cx: xScale(d.x),
        cy: yScale(d.y),
        r: d.s || dotSize,
        duration: 0.66667,
        order: d.index
      }
    },
    hasGeom (d) {
      return this.xScale(d.x) != null && this.yScale(d.x) != null
    }
  }
}
</script>
