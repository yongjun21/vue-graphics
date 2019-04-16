<template>
  <g class="vg-axis vg-x-axis">
    <line class="vg-baseline" :x1="xRange[0]" :x2="xRange[xRange.length - 1]" :y1="y" :y2="y"></line>
    <g class="vg-ticks" v-on="wrappedListeners">
      <g v-for="(x, i) in xInterval" :key="x.label" class="vg-tick">
        <line :x1="x.value" :x2="x.value" :y1="y" :y2="y - tickSize"></line>
        <text-label
          :class="classed && classed(x.label)"
          :x="x.value"
          :y="y - tickSize - tickPadding"
          v-bind="$attrs"
          v-associate="x.label">
          {{formatted(x.label, i)}}
        </text-label>
      </g>
    </g>
    <slot></slot>
  </g>
</template>

<script>
import TextLabel from '../elements/TextLabel'
import {associateDataMixin} from '../mixins'

export default {
  name: 'XAxis',
  components: {TextLabel},
  mixins: [associateDataMixin],
  inheritAttrs: false,
  props: {
    interval: {
      type: Function,
      required: true
    },
    yTranslate: {
      type: Number,
      default: 0
    },
    xScale: {
      type: Function,
      required: true
    },
    yScale: {
      type: Function,
      default: v => v
    },
    tickSize: {
      type: Number,
      default: 6
    },
    tickPadding: {
      type: Number,
      default: 3
    },
    classed: Function,
    formatted: {
      type: Function,
      default: v => typeof v === 'string' ? v : JSON.stringify(v)
    }
  },
  computed: {
    xInterval () {
      return this.interval(this.xScale)
    },
    xRange () {
      return this.xScale.range()
    },
    y () {
      return this.yScale(this.yTranslate)
    }
  }
}
</script>
