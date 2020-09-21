<template>
  <g class="vg-plot vg-stream-plot" v-on="wrappedListeners">
    <path v-for="{label, value} in grouped" :key="label"
      class="vg-area"
      :class="classed && classed(label)"
      v-bind="getGeom(value)"
      v-associate="{label, value}">
    </path>
  </g>
</template>

<script>
import {associateDataMixin} from '../mixins'
import line from 'd3-shape/src/line'
import curveLinearClosed from 'd3-shape/src/curve/linearClosed'

export default {
  name: 'StreamPlot',
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
    y0: {
      type: Function,
      default: x => 0
    },
    z: {
      type: Function,
      default: () => 0
    },
    classed: Function,
    curve: {
      type: Function,
      default: curveLinearClosed
    }
  },
  computed: {
    lineGenerator () {
      const f = line()
        .x(d => d.x)
        .y(d => d.y)
        .curve(this.curve)
      const memo = new WeakMap()
      return data => {
        const memorized = memo.get(data)
        if (memorized) return memorized
        const computed = f(data)
        memo.set(data, computed)
        return computed
      }
    },
    groupedByX () {
      const {dataView, hasGeom, xScale} = this
      const grouped = {}
      dataView.forEach(d => {
        if (!hasGeom(d)) return
        grouped[d.x] = grouped[d.x] || {}
        grouped[d.x][d.g] = d.y
      })
      return Object.keys(grouped)
        .map(key => ({x: xScale(key), y: grouped[key]}))
        .sort((a, b) => a.x - b.x)
    },
    grouped () {
      const {groupedByX, gDomain, yScale, y0, z} = this
      const grouped = []

      groupedByX.forEach(d => {
        d.ymax = 0
        gDomain.forEach(g => {
          d.ymax += d.y[g] || 0
        })
        d.y0 = y0(d.x) - d.ymax / 2
      })

      gDomain.forEach(label => {
        const valueMin = []
        const valueMax = []
        groupedByX.forEach(d => {
          if (d.ymax === 0) return
          valueMin.push({x: d.x, y: yScale(d.y0)})
          d.y0 += d.y[label] || 0
          valueMax.push({x: d.x, y: yScale(d.y0)})
        })
        if (valueMin.length === 0) return
        const value = valueMin.concat(valueMax.reverse())
        grouped.push({label, value, order: z(label)})
      })

      return grouped.sort((a, b) => a.order - b.order)
    }
  },
  methods: {
    getGeom (data) {
      return {d: this.lineGenerator(data)}
    },
    hasGeom (d) {
      return this.xScale(d.x) != null && this.yScale(d.y) != null
    }
  }
}
</script>
