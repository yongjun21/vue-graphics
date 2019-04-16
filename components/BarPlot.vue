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

const geoms = new WeakMap()

export default {
  name: 'BarPlot',
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
    }
  },
  methods: {
    getGeom (d) {
      const {xScale, yScale} = this
      return {
        x: xScale(d.x),
        y: yScale(0),
        width: xScale.bandwidth(),
        height: yScale(d.y) - yScale(0),
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
