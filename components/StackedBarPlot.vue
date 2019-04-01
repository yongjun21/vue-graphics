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
    },
    yOffset () {
      const {x: xDomain, g: gDomain} = this.domain
      const offsetMatrix = xDomain.map(() => gDomain.map(() => [0, 0]))
      this.dataView.forEach(d => {
        const offset = offsetMatrix[xDomain.indexOf(d.x)][gDomain.indexOf(d.g)]
        if (d.y > offset[0]) offset[0] = d.y
        if (d.y < offset[1]) offset[1] = d.y
      })
      offsetMatrix.forEach(row => {
        row.unshift([0, 0])
        row.pop()
        let positiveOffset = 0
        let negativeOffset = 0
        row.forEach(pair => {
          positiveOffset += pair[0]
          negativeOffset += pair[1]
          pair[0] = positiveOffset
          pair[1] = negativeOffset
        })
      })
      return offsetMatrix
    }
  },
  methods: {
    getGeom (d, i) {
      const {bandWidth, domain, xScale, yScale, xOffset, yOffset} = this
      const y = yOffset[domain.x.indexOf(d.x)][domain.g.indexOf(d.g)][d.y >= 0 ? 0 : 1]
      return {
        x: xScale(domain.x.indexOf(d.x) + xOffset),
        y: yScale(y),
        width: xScale(bandWidth, 0),
        height: yScale(d.y, 0),
        duration: 0.66667,
        order: i
      }
    }
  }
}
</script>
