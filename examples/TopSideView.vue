<template>
  <g class="top-side-view">
    <clipPath :id="'clip-path-' + _uid">
      <rect :width="width" :height="height"></rect>
    </clipPath>
    <user-space v-slot="{xRange, yRange}"
      :width="width"
      :height="width"
      :layout="layout"
      :clip-path="`url(#clip-path-${_uid})`">
      <tile-plot
        :get-tile-url="getTileUrl"
        :get-tile-index="getTileIndex"
        :get-tile-position="getTilePosition"
        :x-scale="getScale(domain.x, xRange)"
        :y-scale="getScale(domain.y, yRange)">
      </tile-plot>
      <top-view-plot
        :features="data"
        :classed="f => [getClass(f), {built: f.properties.built <= year}]"
        :bearing="bearing"
        :x-scale="getScale(domain.x, xRange)"
        :y-scale="getScale(domain.y, yRange)">
      </top-view-plot>
    </user-space>

    <user-space v-slot="{xRange, yRange}"
      :top="width + 20"
      :width="width"
      :height="height - width - 20"
      :layout="layout"
      :clip-path="`url(#clip-path-${_uid})`">
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
import TilePlot, {defaultGetTileIndex, defaultGetTilePosition} from '../components/TilePlot.vue'
import TopViewPlot from '../components/TopViewPlot.vue'
import SideViewPlot from '../components/SideViewPlot.vue'
import UserSpace from '../hocs/UserSpace'
import {DomainHelper, TransformHelper} from '../helpers'
import {scaleLinear} from 'd3-scale'

import SVY21 from './SVY21'
const svy21 = new SVY21()

export default {
  name: 'TopSideView',
  components: {TilePlot, TopViewPlot, SideViewPlot, UserSpace},
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
    hDomain: {
      type: [Function, Array],
      default: DomainHelper.CLAMPED_MINMAX('h', 0)
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
      const {data, h, hDomain} = this
      const xDomain = DomainHelper.BBOX(0)(data)
      const yDomain = DomainHelper.BBOX(1)(data)
      const hDomain_ = Array.isArray(hDomain) ? hDomain
                    : hDomain(data.map(f => ({h: h(f)})))
      const xMid = 0.8 * xDomain[0] + 0.2 * xDomain[1]
      const yMid = 0.5 * yDomain[0] + 0.5 * yDomain[1]
      const halfwidth = 0.5 * Math.max((xDomain[1] - xDomain[0]) * 0.4, yDomain[1] - yDomain[0])
      return [xMid, yMid, halfwidth, hDomain_]
    },
    domain () {
      const [xMid, yMid, halfwidth, hDomain] = this.domainStatic
      const [xCenter, yCenter] = new TransformHelper().rotate(this.bearing).apply([xMid, yMid])
      return {
        x: [xCenter - halfwidth, xCenter + halfwidth],
        y: [yCenter - halfwidth, yCenter + halfwidth],
        h: hDomain
      }
    },
    getTileUrl () {
      return 'https://api.mapbox.com/styles/v1/chachopazos/cjxemaj7e025i1cmuwcxbndu2/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiY2hhY2hvcGF6b3MiLCJhIjoiY2pkMDN3eW4wNHkwZDJ5bGc0cnpueGNxbCJ9.WWWg_OnK5e7L1RknMliY4A'
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
    },
    getTileIndex (x, y, z) {
      const {lat, lon} = svy21.computeLatLon(y, x)
      return defaultGetTileIndex(lon, lat, z)
    },
    getTilePosition (x, y, z) {
      const [lon, lat] = defaultGetTilePosition(x, y, z)
      const {N, E} = svy21.computeSVY21(lat, lon)
      return [E, N, z]
    }
  }
}
</script>
