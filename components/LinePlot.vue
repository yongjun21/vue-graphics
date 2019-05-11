<template>
  <g class="vg-plot vg-line-plot" v-on="wrappedListeners">
    <path v-for="(value, label) in grouped" :key="label" v-if="value.length > 0"
      class="vg-line"
      :class="classed && classed(label)"
      v-bind="getGeom(value)"
      v-enlarge-target
      v-associate="{label, value}">
    </path>
  </g>
</template>

<script>
import {associateDataMixin} from '../mixins'
import EnlargeTarget from '../directives/v-enlarge-target'
import line from 'd3-shape/src/line'
import curveLinear from 'd3-shape/src/curve/linear'

export default {
  name: 'LinePlot',
  directives: {EnlargeTarget},
  mixins: [associateDataMixin],
  inheritAttrs: false,
  props: {
    dataView: {
      type: Array,
      required: true
    },
    gDomain: {
      type: Array,
      default: () => [undefined]
    },
    xScale: {
      type: Function,
      default: v => v
    },
    yScale: {
      type: Function,
      default: v => v
    },
    classed: Function,
    curve: {
      type: Function,
      default: curveLinear
    }
  },
  computed: {
    grouped () {
      const {gDomain, dataView, hasGeom} = this
      const grouped = {}
      gDomain.forEach(g => {
        grouped[g] = dataView.filter(d => d.g === g && hasGeom(d))
      })
      return grouped
    }
  },
  methods: {
    getGeom (data) {
      const {xScale, yScale, curve} = this
      const lineGenerator = line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y))
        .curve(curve)
      return {d: lineGenerator(data)}
    },
    hasGeom (d) {
      return this.xScale(d.x) != null && this.yScale(d.y) != null
    }
  }
}
</script>
