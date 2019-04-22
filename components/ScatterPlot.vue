<template>
  <g class="vg-plot vg-scatter-plot" v-on="wrappedListeners">
    <animated-group :enter="{r: 0}" :exit="{r: 0}">
      <circle v-for="(d, i) in dataView" :key="d.key" v-if="hasGeom(d)"
        class="vg-dot"
        :class="d.class"
        v-associate="d"
        v-animated:[_uid]="getGeom(d, i)">
      </circle>
    </animated-group>
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
    getGeom (d, i) {
      const {xScale, yScale, dotSize} = this
      return {
        cx: xScale(d.x),
        cy: yScale(d.y),
        r: d.s || dotSize,
        duration: 0.66667,
        order: i
      }
    },
    hasGeom (d) {
      return this.xScale(d.x) != null && this.yScale(d.x) != null
    }
  }
}
</script>
