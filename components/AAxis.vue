<template>
  <g class="vg-axis vg-a-axis">
    <arc class="vg-baseline" :a1="aRange[0]" :a2="aRange[aRange.length - 1]" :r="r"></arc>
    <g class="vg-ticks" v-on="wrappedListeners">
      <g v-for="(a, i) in aInterval" :key="getKey(a.label, i)" class="vg-tick">
        <line :y1="-r" :y2="-(r + tickSize)" :transform="`rotate(${a.value})`"></line>
        <radial-text-label
          :class="classed && classed(a.label)"
          :a="a.value"
          :r="r + tickSize + tickPadding"
          :anchor="ccw ? 'right' : 'left'"
          :rotate="ccw ? 90 : -90"
          v-associate="a.label">
          {{formatted(a.label, i)}}
        </radial-text-label>
      </g>
    </g>
    <slot></slot>
  </g>
</template>

<script>
import Arc from '../elements/Arc'
import RadialTextLabel from '../elements/RadialTextLabel'
import {associateDataMixin} from '../mixins'

export default {
  name: 'AAxis',
  components: {Arc, RadialTextLabel},
  mixins: [associateDataMixin],
  inheritAttrs: false,
  props: {
    interval: {
      type: Function,
      required: true
    },
    rOffset: {
      type: Number,
      required: true
    },
    aScale: {
      type: Function,
      required: true
    },
    rScale: {
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
    aInterval () {
      return this.interval(this.aScale)
    },
    aRange () {
      return this.aScale.range()
    },
    r () {
      return this.rScale(this.rOffset)
    },
    ccw () {
      return this.aRange[0] > this.aRange[1]
    }
  },
  methods: {
    getKey (v, i) {
      return (typeof v === 'string' || typeof v === 'number') ? v : i
    }
  }
}
</script>
