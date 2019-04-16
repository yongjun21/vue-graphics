<template>
  <g class="vg-axis vg-y-axis">
    <line class="vg-baseline" :x1="x" :x2="x" :y1="yRange[0]" :y2="yRange[yRange.length - 1]"></line>
    <g class="vg-ticks" v-on="wrappedListeners">
      <g v-for="(y, i) in yInterval" :key="y.label" class="vg-tick">
        <line :x1="x" :x2="x - tickSize" :y1="y.value" :y2="y.value"></line>
        <text-label
          :class="classed && classed(y.label)"
          :x="x - tickSize - tickPadding"
          :y="y.value"
          v-bind="$attrs"
          v-associate="y.label">
          {{formatted(y.label, i)}}
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
  name: 'YAxis',
  components: {TextLabel},
  mixins: [associateDataMixin],
  inheritAttrs: false,
  props: {
    interval: {
      type: Function,
      required: true
    },
    xTranslate: {
      type: Number,
      default: 0
    },
    xScale: {
      type: Function,
      default: v => v
    },
    yScale: {
      type: Function,
      required: true
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
    yInterval () {
      return this.interval(this.yScale)
    },
    yRange () {
      return this.yScale.range()
    },
    x () {
      return this.xScale(this.xTranslate)
    }
  }
}
</script>
