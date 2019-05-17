<template>
  <g class="vg-plot vg-bar-plot" v-on="wrappedListeners">
    <animated-group :enter="enterGeom" :exit="exitGeom">
      <rect v-for="(d, i) in dataView" :key="d.key || i" v-if="hasGeom(d)"
        class="vg-bar"
        :class="d.class"
        v-associate="d"
        v-animated="getGeom(d, i)">
      </rect>
    </animated-group>
    <slot v-bind="{getGeom, hasGeom}"></slot>
  </g>
</template>

<script>
import {animationMixin, associateDataMixin} from '../mixins'

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
  computed: {
    enterGeom () {
      return {
        y: this.yScale(0),
        height: 0,
        animation: this.getAnimation(Infinity)
      }
    },
    exitGeom () {
      return {
        y: this.yScale(0),
        height: 0,
        animation: this.getAnimation(-Infinity)
      }
    },
    appear () {
      return this.enterGeom
    }
  },
  methods: {
    getGeom (d, i) {
      const {xScale, yScale} = this
      const y1 = yScale(d.y1)
      const y2 = yScale(d.y2)
      return {
        x: xScale(d.x),
        y: Math.min(y1, y1),
        width: xScale.bandwidth(),
        height: Math.abs(y2 - y1),
        animation: this.getAnimation(i)
      }
    },
    hasGeom (d) {
      return this.xScale(d.x) != null && this.yScale(d.y1) != null && this.yScale(d.y2) != null
    }
  }
}
</script>
