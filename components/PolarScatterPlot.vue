<template>
  <g class="vg-plot vg-scatter-plot" v-on="wrappedListeners">
    <animated-group
      :watching="dataView"
      :enter="enterGeom"
      :exit="exitGeom"
      :appear="enterGeom">
      <circle v-for="(d, i) in dataView" :key="d.key || i" v-if="hasGeom(d)"
        class="vg-dot"
        :class="d.class"
        v-associate="d"
        v-animated="getGeom(d, i)">
      </circle>
    </animated-group>
    <slot v-bind="{getGeom, hasGeom}"></slot>
  </g>
</template>

<script>
import {animationMixin, associateDataMixin} from '../mixins'

export default {
  name: 'PolarScatterPlot',
  mixins: [animationMixin, associateDataMixin],
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
  computed: {
    enterGeom () {
      return {
        r: 0,
        animation: this.getAnimation(Infinity)
      }
    },
    exitGeom () {
      return {
        r: 0,
        animation: this.getAnimation(-Infinity)
      }
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
        animation: this.getAnimation(i)
      }
    },
    hasGeom (d) {
      return this.aScale(d.a) != null && this.rScale(d.r) != null
    }
  }
}
</script>
