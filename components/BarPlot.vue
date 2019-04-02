<template>
  <g class="vg-plot vg-bar-plot" v-on="wrapListeners($listeners)">
    <rect v-for="(d, i) in dataView" :key="d.key"
      class="vg-bar"
      :class="d.class"
      v-associate="d"
      v-animated:[_uid]="getGeom(d, i)">
    </rect>
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
    domain: {
      type: Object,
      required: true
    },
    xScale: {
      type: Function,
      default: (v, v0 = 0) => v - v0
    },
    yScale: {
      type: Function,
      default: (v, v0 = 0) => v - v0
    },
    bandWidth: {
      type: Number,
      default: 0.9
    }
  },
  computed: {
    xOffset () {
      return (1 - this.bandWidth) / 2
    }
  },
  methods: {
    getGeom (d, i) {
      const {bandWidth, domain, xScale, yScale, xOffset} = this
      return {
        x: xScale(domain.x.indexOf(d.x) + xOffset),
        y: yScale(0),
        width: xScale(bandWidth, 0),
        height: yScale(d.y, 0),
        duration: 0.66667,
        order: i
      }
    }
  }
}
</script>
