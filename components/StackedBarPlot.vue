<template>
  <g class="vg-plot vg-bar-plot" v-on="wrappedListeners">
    <rect v-for="(d, i) in dataView" :key="d.key" v-if="hasGeom(d)"
      class="vg-bar"
      :class="d.class"
      v-associate="d"
      v-animated:[_uid]="getGeom(d, i)">
    </rect>
  </g>
</template>

<script>
import {animationMixin, associateDataMixin} from '../mixins'
import {SplitApplyCombine} from '../helpers'

export default {
  name: 'StackedBarPlot',
  mixins: [animationMixin, associateDataMixin],
  inheritAttrs: false,
  props: {
    dataView: {
      type: Array,
      required: true
    },
    gDomain: {
      type: Array,
      required: true
    },
    xScale: {
      type: Function,
      required: true
    },
    yScale: {
      type: Function,
      default: v => v
    }
  },
  computed: {
    yOffset () {
      const {gDomain, hasGeom} = this
      const offset = new Map()

      SplitApplyCombine(this.dataView.filter(hasGeom))
        .split('x')
        .apply((members, group) => {
          const offsetByG = new Map()
          const ordered = gDomain.map(g => [0, 0])
          members.forEach(d => {
            const pair = ordered[gDomain.indexOf(d.g)]
            if (d.y > pair[0]) pair[0] = d.y
            if (d.y < pair[1]) pair[1] = d.y
          })
          ordered.unshift([0, 0])
          ordered.pop()

          let positiveOffset = 0
          let negativeOffset = 0
          ordered.forEach((pair, i) => {
            positiveOffset += pair[0]
            negativeOffset += pair[1]
            offsetByG.set(gDomain[i], [positiveOffset, negativeOffset])
          })
          offset.set(group.x, offsetByG)
        })
        .combine()

      return d => {
        return offset.get(d.x).get(d.g)[d.y >= 0 ? 0 : 1]
      }
    }
  },
  methods: {
    getGeom (d, i) {
      const {xScale, yScale, yOffset} = this
      const y0 = yOffset(d)
      return {
        x: xScale(d.x),
        y: yScale(y0),
        width: xScale.bandwidth(),
        height: yScale(y0 + d.y) - yScale(y0),
        duration: 0.66667,
        order: i
      }
    },
    hasGeom (d) {
      return this.xScale(d.x) != null && this.yScale(d.y) != null && this.gDomain.includes(d.g)
    }
  }
}
</script>
