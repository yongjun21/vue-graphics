<template>
  <g class="vg-plot vg-bar-plot" v-on="wrappedListeners">
    <animated-group :enter="enterGeom" :exit="exitGeom">
      <rect v-for="(d, i) in dataView" :key="d.key || i" v-if="hasGeom(d)"
        class="vg-bar"
        :class="d.class"
        v-associate="d"
        v-animated="getGeom(d, i)">
      </rect>
    </animated-group>
    <slot v-bind="{getGeom, hasGeom}"></slot>
  </g>
</template>

<script>
import {animationMixin, associateDataMixin} from '../mixins'

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
    xDomain () {
      return this.xScale.domain()
    },
    yOffset () {
      const {gDomain, xDomain, hasGeom} = this
      const offset = new WeakMap()
      const minY = xDomain.map(() => 0)
      const maxY = xDomain.map(() => 0)

      this.dataView
        .filter(hasGeom)
        .sort((a, b) => gDomain.indexOf(a.g) - gDomain.indexOf(b.g))
        .forEach(d => {
          const xIndex = xDomain.indexOf(d.x)
          if (d.y < 0) {
            offset.set(d, minY[xIndex])
            minY[xIndex] += d.y
          } else {
            offset.set(d, maxY[xIndex])
            maxY[xIndex] += d.y
          }
        })

      return d => offset.get(d)
    },
    enterGeom () {
      return {
        y: this.yScale(0),
        height: 0,
        animation: this.getAnimation(Infinity)
      }
    },
    exitGeom () {
      return {
        y: this.yScale(0),
        height: 0,
        animation: this.getAnimation(-Infinity)
      }
    },
    appear () {
      return this.enterGeom
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
        animation: this.getAnimation(i)
      }
    },
    hasGeom (d) {
      return this.xScale(d.x) != null && this.yScale(d.y) != null && this.gDomain.includes(d.g)
    }
  }
}
</script>
