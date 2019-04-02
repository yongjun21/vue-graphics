<template>
  <g class="vg-plot" v-on="wrapListeners($listeners)">
    <user-space v-for="(group, i) in grouped" :key="i"
      class="vg-sub-plot vg-bar-plot"
      :left="xScale(i + xOffset)"
      :top="yScale(yRange[0])"
      :width="xScale(groupBandWidth, 0)"
      :height="yScale(yRange[1], yRange[0])"
      :x-range="gRange"
      :y-range="yRange">
      <template v-slot="{xScale, yScale}">
        <rect v-for="(d, i) in group" :key="d.key"
          class="vg-bar"
          :class="d.class"
          v-associate="d"
          v-animated:[_uid]="getGeom(d, i, xScale, yScale)">
        </rect>
      </template>
    </user-space>
  </g>
</template>

<script>
import {UserSpace} from '../hocs'
import {animationMixin, associateDataMixin} from '../mixins'
import {RangeHelper} from '../helpers'

export default {
  name: 'GroupBarPlot',
  components: {UserSpace},
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
    },
    groupBandWidth: {
      type: Number,
      default: 0.9
    }
  },
  computed: {
    grouped () {
      const grouped = new Map()
      this.domain.x.forEach(group => {
        grouped.set(group, [])
      })
      this.dataView.forEach(d => {
        if (grouped.has(d.x)) grouped.get(d.x).push(d)
      })
      return this.domain.x.map(group => grouped.get(group))
    },
    xOffset () {
      return (1 - this.groupBandWidth) / 2
    },
    gOffset () {
      return (1 - this.bandWidth) / 2
    },
    gRange: RangeHelper.DISCRETE('g'),
    yRange: RangeHelper.CONTINUOUS('y')
  },
  methods: {
    getGeom (d, i, xScale, yScale) {
      const {bandWidth, domain, gOffset} = this
      return {
        x: xScale(domain.g.indexOf(d.g) + gOffset),
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
