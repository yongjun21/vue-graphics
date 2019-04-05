<template>
  <g class="vg-plot vg-scatter-plot" v-on="wrappedListeners">
    <circle v-for="(d, i) in dataView" :key="d.key" v-if="hasGeom(d)"
      class="vg-dot"
      :class="d.class"
      v-associate="d"
      v-animated:[_uid]="getGeom(d, i)">
    </circle>
  </g>
</template>

<script>
import {animationMixin, associateDataMixin} from '../mixins'

export default {
  name: 'PolarScatterPlot',
  mixins: [animationMixin, associateDataMixin],
  inheritAttrs: false,
  props: {
    dataView: {
      type: Array,
      required: true
    },
    aScale: {
      type: Function,
      default: v => v
    },
    rScale: {
      type: Function,
      default: v => v
    },
    dotSize: {
      type: Number,
      default: 8
    }
  },
  methods: {
    getGeom (d, i) {
      const {aScale, rScale, dotSize} = this
      return {
        cx: 0,
        cy: -rScale(d.r),
        transform: `rotate(${aScale(d.a)})`,
        r: d.s || dotSize,
        duration: 0.66667,
        order: i
      }
    },
    hasGeom (d) {
      return this.aScale(d.a) != null && this.rScale(d.r) != null
    }
  }
}
</script>
