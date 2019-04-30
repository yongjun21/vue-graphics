<template>
  <g class="vg-axis vg-y-axis">
    <line class="vg-baseline" :x1="x" :x2="x" :y1="yRange[0]" :y2="yRange[yRange.length - 1]"></line>
    <g class="vg-ticks" v-on="wrappedListeners">
      <g v-for="(y, i) in yInterval" :key="getKey(y.label, i)" class="vg-tick">
        <line :x1="x" :x2="x + direction * tickSize" :y1="y.value" :y2="y.value"></line>
        <text-label
          :class="classed && classed(y.label)"
          :x="x + direction * (tickSize + tickPadding)"
          :y="y.value"
          :anchor="anchor"
          :rotate="rotate"
          :post-transform="postTransform"
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
import {TransformHelper} from '../helpers'

const anchorValues = [
  'topleft',
  'top',
  'topright',
  'right',
  'bottomright',
  'bottom',
  'bottomleft',
  'left',
  'middle'
]

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
    anchor: {
      validator: prop => anchorValues.includes(prop)
    },
    rotate: Number,
    postTransform: TransformHelper,
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
    },
    direction () {
      if (this.anchor == null || this.anchor === 'middle') return 1
      const t = this.postTransform ? this.postTransform.clone() : new TransformHelper()
      t.params.e = 0
      t.params.f = 0
      if (this.rotate) t.rotate(-this.rotate)
      const [x, y] = t.apply([1, 0])
      const lower = (-4 + anchorValues.indexOf(this.anchor)) * Math.PI / 4
      const upper = lower + Math.PI / 2
      const a = Math.atan2(y, x)
      return (a > lower && a < upper) ? -1 : 1
    }
  },
  methods: {
    getKey (v, i) {
      return (typeof v === 'string' || typeof v === 'number') ? v : i
    }
  }
}
</script>
