<template>
  <g class="vg-axis vg-r-axis" :transform="`rotate(${a})`">
    <line class="vg-baseline" :y1="-rRange[0]" :y2="-rRange[rRange.length - 1]"></line>
    <g class="vg-ticks" v-on="wrappedListeners">
      <g v-for="(r, i) in rInterval" :key="getKey(r.label, i)" class="vg-tick">
        <line :x2="tickSize" :y1="-r.value" :y2="-r.value"></line>
        <text-label
          :class="classed && classed(r.label)"
          :x="tickSize + tickPadding"
          :y="-r.value"
          :anchor="tickSize < 0 ? 'right' : 'left'"
          v-associate="r.label">
          {{formatted(r.label, i)}}
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
  name: 'RAxis',
  components: {TextLabel},
  mixins: [associateDataMixin],
  inheritAttrs: false,
  props: {
    interval: {
      type: Function,
      required: true
    },
    aRotate: {
      type: Number,
      default: 0
    },
    aScale: {
      type: Function,
      default: v => v
    },
    rScale: {
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
    rInterval () {
      return this.interval(this.rScale)
    },
    rRange () {
      return this.rScale.range()
    },
    a () {
      return this.aScale(this.aRotate)
    }
  }
}
</script>
