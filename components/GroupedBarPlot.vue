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
    <slot v-bind="{getGeom, hasGeom, getAnimation}"></slot>
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
    },
    enterGeom () {
      return {
        height: 0,
        animation: this.getAnimation(Infinity)
      }
    },
    exitGeom () {
      return {
        height: 0,
        animation: this.getAnimation(-Infinity)
      }
    }
  },
  methods: {
    getGeom (d, i) {
      const {yScale} = this
      const xScale = this.subScales[d.x]
      return {
        x: xScale(d.g),
        y: yScale(0),
        width: xScale.bandwidth(),
        height: yScale(d.y) - yScale(0),
        animation: this.getAnimation(i)
      }
    },
    hasGeom (d) {
      return this.xScale(d.x) != null && this.yScale(d.y) != null && this.gScale(d.g) != null
    }
  }
}
</script>
