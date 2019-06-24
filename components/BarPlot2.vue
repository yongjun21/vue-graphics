<template>
  <g class="vg-plot vg-bar-plot" v-on="wrappedListeners">
    <clipPath :id="'clip-path-' + _uid">
      <rect v-bind="clipPathGeom"></rect>
    </clipPath>
    <animated-group
      :clip-path="`url(#clip-path-${_uid})`"
      :watching="dataView"
      :enter="enterGeom"
      :exit="exitGeom"
      :appear="enterGeom">
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
    clipPathGeom () {
      const xRange = this.xScale.range()
      const yRange = this.yScale.range()
      return {
        x: Math.min(xRange[0], xRange[xRange.length - 1]),
        y: Math.min(yRange[0], yRange[yRange.length - 1]),
        width: Math.abs(xRange[xRange.length - 1] - xRange[0]),
        height: Math.abs(yRange[yRange.length - 1] - yRange[0])
      }
    },
    xIn () {
      const {xScale} = this
      const xDomain = xScale.domain()
      const xRange = xScale.range()
      const reverse = xRange[0] > xRange[xRange.length - 1]
      return xScale(xDomain[xDomain.length - 1]) + (reverse ? -1 : 1) * xScale.step()
    },
    enterGeom () {
      return {
        x: this.xIn,
        animation: this.getAnimation(Infinity)
      }
    },
    exitGeom () {
      return {
        x: this.xIn,
        animation: this.getAnimation(-Infinity)
      }
    }
  },
  methods: {
    getGeom (d, i) {
      const {xScale, yScale} = this
      const y0 = yScale(0)
      const y1 = yScale(d.y)
      return {
        x: xScale(d.x),
        y: Math.min(y0, y1),
        width: xScale.bandwidth(),
        height: Math.abs(y1 - y0),
        animation: this.getAnimation(i)
      }
    },
    hasGeom (d) {
      return this.xScale(d.x) != null && this.yScale(d.y) != null
    }
  }
}
</script>
