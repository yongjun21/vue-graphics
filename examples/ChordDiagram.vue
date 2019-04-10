<template>
  <g class="chord-diagram" :transform="transform">
    <chord-plot
      :data-view="links"
      :a-scale="aScale"
      :r="0.7 * radius - 6">
    </chord-plot>
    <polar-scatter-plot
      :dataView="sortedDataView"
      :a-scale="aScale"
      :dot-size="3">
    </polar-scatter-plot>
    <g class="axes" v-measure-text="measure">
      <a-axis v-for="(aScale, i) in aSubScales" :key="'axis-' + domain.g[i]"
        :interval="aInterval"
        :a-scale="aScale"
        :r-offset="radius"
        :tick-size="0"
        :tick-padding="-0.3 * radius"
        :classed="v => ({source: v === origin.a})"
        @click="changeSelected">
        <arc-text-label :key="'axis-label-' + domain.g[i]"
          class="axis-label"
          :r="radius + 20"
          :a="getMidpoint(aScale)">
          {{domain.g[i]}}
        </arc-text-label>
      </a-axis>
    </g>
  </g>
</template>

<script>
import ChordPlot from '../components/ChordPlot.vue'
import PolarScatterPlot from '../components/PolarScatterPlot.vue'
import AAxis from '../components/AAxis.vue'
import ArcTextLabel from '../elements/ArcTextLabel.js'
import MeasureText from '../directives/v-measure-text.js'
import {dataViewMixin, userSpaceMixin} from '../mixins'
import {DomainHelper, IntervalHelper, ScaleHelper} from '../helpers'
import {scalePoint} from 'd3-scale'

export default {
  name: 'ChordDiagram',
  components: {ChordPlot, PolarScatterPlot, AAxis, ArcTextLabel},
  directives: {MeasureText},
  mixins: [dataViewMixin, userSpaceMixin],
  inheritAttrs: false,
  props: {
    a: {
      type: [Function, String, Number],
      required: true
    },
    g: {
      type: [Function, String, Number],
      required: true
    },
    aDomain: {
      type: [Function, Array],
      default: DomainHelper.UNIQUE('a')
    },
    gDomain: {
      type: [Function, Array],
      default: DomainHelper.UNIQUE('g')
    }
  },
  data () {
    return {
      originAt: 'xMidYMid',
      selected: 'SG'
    }
  },
  computed: {
    radius () {
      return Math.min(this.xRange[1], this.yRange[1])
    },
    origin () {
      const {selected} = this
      return this.dataView.find(d => d.key === selected)
    },
    groupedADomain () {
      const {dataView, domain} = this
      return domain.g.map(g => {
        return domain.a.filter(a => {
          return dataView.some(d => d.a === a && d.g === g)
        })
      })
    },
    sortedADomain () {
      const {groupedADomain} = this
      return this.domain.g.reduce((arr, g, i) => arr.concat(groupedADomain[i]), [])
    },
    sortedDataView () {
      const {dataView, origin, radius} = this
      return this.sortedADomain.map(a => {
        const d = Object.assign({}, dataView.find(d => d.a === a))
        d.r = 0.7 * radius - 6
        d.class = [
          'type-' + (origin.datum[d.key] || 0),
          {source: d.key === origin.key}
        ]
        return d
      })
    },
    links () {
      const {origin, radius} = this
      const gIndex = this.domain.g.indexOf(origin.g)
      const startIndex = this.groupedADomain.slice(0, gIndex)
        .reduce((sum, arr) => sum + arr.length, 0)
      const destinations = this.sortedDataView
        .map((d, i, arr) => arr[(i + startIndex) % arr.length])
        .filter(d => origin.datum[d.key] > 1)
      return destinations.map(destination => ({
        key: origin.key + '>' + destination.key,
        a1: origin.a,
        a2: destination.a,
        r: 0.7 * radius - 6,
        class: destination.class
      }))
    },
    aScale () {
      return scalePoint()
        .domain(this.sortedADomain)
        .range([0, 360])
        .padding(0.5)
        .align(0)
    },
    aSubScales () {
      return this.groupedADomain.map((subset, i) => {
        const reverse = ['Americas', 'Africa', 'Oceania'].includes(this.domain.g[i])
        const start = reverse ? subset[subset.length - 1] : subset[0]
        const stop = reverse ? subset[0] : subset[subset.length - 1]
        return ScaleHelper.SUBSET(this.aScale, start, stop)
      })
    },
    measure () {
      return {
        target: '.vg-tick text',
        callback: console.log
      }
    }
  },
  methods: {
    aInterval: IntervalHelper.MIDDLE(),
    getMidpoint (scale) {
      const range = scale.range()
      return 0.5 * range[0] + 0.5 * range[range.length - 1]
    },
    changeSelected (label) {
      const selected = this.dataView.find(d => d.a === label).key
      this.selected = selected
      this.$emit('change', selected)
    }
  }
}
</script>
