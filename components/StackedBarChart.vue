<template>
    <g class="vg-chart vg-stacked-bar-chart" :transform="transform.toString()">
    <g class="vg-bars" v-on="wrapListeners($listeners)">
      <rect v-for="(bar, i) in dataProps" :key="bar.key"
        class="vg-bar"
        :class="bar.class"
        v-associate="bar"
        v-animated:[_uid]="getBarAttrs(bar, i)">
      </rect>
    </g>
    <slot v-bind="{transform, domain}"></slot>
  </g>
</template>

<script>
import {dataPropsMixin, userSpaceMixin, animationMixin, associateDataMixin} from '../mixins'
import {DomainHelper, TransformHelper, SplitApplyCombine} from '../helpers'

export default {
  name: 'StackedBarChart',
  mixins: [dataPropsMixin, userSpaceMixin, animationMixin, associateDataMixin],
  props: {
    x: {
      type: [Function, String],
      required: true
    },
    y: {
      type: [Function, String],
      required: true
    },
    g: {
      type: [Function, String],
      required: true
    },
    xDomain: {
      type: [Array, Function],
      default: () => DomainHelper.UNIQUE('x')
    },
    yDomain: {
      type: [Array, Function],
      default: () => {
        return data => {
          const stacked = SplitApplyCombine(data)
            .split('x')
            .split('g')
            .apply((members, group) => {
              const values = members.map(d => d.y)
              group.minY = values.reduce((min, v) => v < min ? v : min, 0)
              group.maxY = values.reduce((max, v) => v > max ? v : max, 0)
            })
            .combine()
            .split('x')
            .apply((members, group) => {
              const plus = members.map(d => d.maxY)
              const minus = members.map(d => d.minY)
              group.stackedYPlus = plus.reduce((sum, v) => sum + v)
              group.stackedYMinus = minus.reduce((sum, v) => sum + v)
            })
            .combine()
          return [
            stacked.reduce((min, v) => v.stackedYMinus < min ? v.stackedYMinus : min, 0),
            stacked.reduce((max, v) => v.stackedYPlus > max ? v.stackedYPlus : max, 0)
          ]
        }
      }
    },
    horizontal: {
      type: Boolean,
      default: false
    },
    bandWidth: {
      type: Number,
      default: 0.9
    }
  },
  computed: {
    baseTransform () {
      const t = new TransformHelper()
      return this.horizontal ? t.invert() : t.flipY()
    },
    xRange () {
      return [0, this.domain.x.length]
    },
    yRange () {
      return this.domain.y
    },
    yOffset () {
      const {x: xDomain, g: gDomain} = this.domain
      const offsetMatrix = xDomain.map(() => gDomain.map(() => [0, 0]))
      this.dataProps.forEach(d => {
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
    getBarAttrs (d, i) {
      const {bandWidth, domain, yOffset} = this
      const xOffset = (1 - bandWidth) / 2
      const y = yOffset[domain.x.indexOf(d.x)][domain.g.indexOf(d.g)][d.y >= 0 ? 0 : 1]
      return {
        x: domain.x.indexOf(d.x) + xOffset,
        y,
        width: bandWidth,
        height: d.y,
        duration: 0.66667,
        order: i
      }
    }
  }
}
</script>
