<template>
  <g class="vg-axis vg-x-axis">
    <line class="vg-baseline" :x1="xRange[0]" :x2="xRange[xRange.length - 1]" :y1="y" :y2="y"></line>
    <g class="vg-ticks" v-on="wrappedListeners">
      <g v-for="(x, i) in xInterval" :key="getKey(x.label, i)" class="vg-tick">
        <line :x1="x.value" :x2="x.value" :y1="y" :y2="y + direction * tickSize"></line>
        <text-label
          :class="classed && classed(x.label)"
          :x="x.value"
          :y="y + direction * (tickSize + tickPadding)"
          :anchor="anchor"
          :rotate="rotate"
          :post-transform="postTransform"
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
  name: 'XAxis',
  components: {TextLabel},
  mixins: [associateDataMixin],
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
    xInterval () {
      return this.interval(this.xScale)
    },
    xRange () {
      return this.xScale.range()
    },
    y () {
      return this.yScale(this.yTranslate)
    },
    direction () {
      if (this.anchor == null || this.anchor === 'middle') return 1
      const t = this.postTransform ? this.postTransform.clone() : new TransformHelper()
      t.params.e = 0
      t.params.f = 0
      if (this.rotate) t.rotate(-this.rotate)
      const [x, y] = t.apply([0, 1])
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
