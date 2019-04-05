<template>
  <g class="chord-diagram" :transform="transform.toString()">
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
      <a-axis v-for="(aScale, i) in aSubScales" :key="i"
        :interval="aInterval"
        :a-scale="aScale"
        :r="radius"
        :tick-size="0"
        :tick-padding="-0.3 * radius"
        @click="changeSelected">
      </a-axis>
    </g>
    <g class="axis-labels">
      <arc-text-label v-for="(midpoint, i) in aSubScaleMidpoints" :key="i"
        class="axis-label"
        :r="radius + 20"
        :a="midpoint">
        {{domain.g[i]}}
      </arc-text-label>
    </g>
  </g>
</template>

<script>
import ChordPlot from '../components/ChordPlot.vue'
import PolarScatterPlot from '../components/PolarScatterPlot.vue'
import AAxis from '../components/AAxis.js'
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
    aDomain: {
      type: [Function, Array],
      default: DomainHelper.UNIQUE('a')
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
      const datum = this.origin.datum
      const gIndex = this.domain.g.indexOf(this.origin.g)
      const startIndex = this.groupedADomain.slice(0, gIndex)
        .reduce((sum, arr) => sum + arr.length, 0)
      const destinations = this.sortedDataView
        .map((d, i, arr) => arr[(i + startIndex) % arr.length])
        .filter(d => datum[d.key] > 1)
      return destinations.map(destination => ({
        key: origin.key + '>' + destination.key,
        o: this.origin,
        d: destination,
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
    aSubScaleMidpoints () {
      return this.aSubScales.map(scale => {
        const range = scale.range()
        return (range[0] + range[range.length - 1]) / 2
      })
    },
    measure () {
      return {
        target: '.vg-tick-labels text',
        callback: console.log
      }
    }
  },
  methods: {
    aInterval: IntervalHelper.MIDDLE(),
    changeSelected (label) {
      const selected = this.dataView.find(d => d.a === label).key
      this.selected = selected
      this.$emit('change', selected)
    }
  }
}
</script>
