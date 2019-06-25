<template>
  <g class="top-side-view">
    <user-space :width="width" :height="width" :layout="layout" v-slot="{xRange, yRange}">
      <top-view-plot
        :features="data"
        :classed="f => [getClass(f), {built: f.properties.built <= year}]"
        :bearing="bearing"
        :x-scale="getScale(domain.x, xRange)"
        :y-scale="getScale(domain.y, yRange)">
      </top-view-plot>
    </user-space>

    <user-space :top="width" :width="width" :height="height - width" :layout="layout"  v-slot="{xRange, yRange}">
      <side-view-plot
        :features="filteredData"
        :classed="getClass"
        :bearing="bearing"
        :x-scale="getScale(domain.x, xRange)"
        :y-scale="getScale(domain.h, yRange)"
        :height="h">
      </side-view-plot>
    </user-space>
  </g>
</template>

<script>
import TopViewPlot from '../components/TopViewPlot.vue'
import SideViewPlot from '../components/SideViewPlot.vue'
import UserSpace from '../hocs/UserSpace'
import {DomainHelper, TransformHelper} from '../helpers'
import {scaleLinear} from 'd3-scale'

export default {
  name: 'TopSideView',
  components: {TopViewPlot, SideViewPlot, UserSpace},
  inheritAttrs: false,
  props: {
    width: Number,
    height: Number,
    data: {
      type: Array,
      required: true
    },
    h: {
      type: Function,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    bearing: {
      type: Number,
      default: 0
    }
  },
  computed: {
    layout () {
      return new TransformHelper().flipY()
    },
    filteredData () {
      const {year} = this
      return this.data.filter(f => f.properties.built <= year)
    },
    domainStatic () {
      const {data, h} = this
      const xDomain = DomainHelper.BBOX(0)(data)
      const yDomain = DomainHelper.BBOX(1)(data)
      const hDomain = DomainHelper.CLAMPED_MINMAX(0, 0)(data.map(f => [h(f)]))
      const xMid = 0.8 * xDomain[0] + 0.2 * xDomain[1]
      const yMid = 0.5 * yDomain[0] + 0.5 * yDomain[1]
      const halfwidth = 0.5 * Math.max((xDomain[1] - xDomain[0]) * 0.4, yDomain[1] - yDomain[0])
      return [xMid, yMid, halfwidth, hDomain]
    },
    domain () {
      const [xMid, yMid, halfwidth, hDomain] = this.domainStatic
      const [xCenter, yCenter] = new TransformHelper().rotate(this.bearing).apply([xMid, yMid])
      return {
        x: [xCenter - halfwidth, xCenter + halfwidth],
        y: [yCenter - halfwidth, yCenter + halfwidth],
        h: hDomain
      }
    }
  },
  methods: {
    getScale (domain, range) {
      return scaleLinear()
        .domain(domain)
        .range(range)
    },
    getClass (f) {
      const built = f.properties.built
      if (built < 1970) return 'y1960'
      if (built < 1980) return 'y1970'
      if (built < 1990) return 'y1980'
      if (built < 2000) return 'y1990'
      if (built < 2010) return 'y2000'
      if (built < 2020) return 'y2010'
      return null
    }
  }
}
</script>
