<template>
  <g class="vg-chart vg-bar-chart" :transform="transform.toString()">
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
import {DomainHelper, TransformHelper} from '../helpers'

export default {
  name: 'BarChart',
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
    xDomain: {
      type: [Array, Function],
      default: () => DomainHelper.UNIQUE('x')
    },
    yDomain: {
      type: [Array, Function],
      default: () => DomainHelper.CLAMPED_MINMAX('y', 0)
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
    }
  },
  methods: {
    getBarAttrs (d, i) {
      const {bandWidth, domain} = this
      const xOffset = (1 - bandWidth) / 2
      return {
        x: domain.x.indexOf(d.x) + xOffset,
        y: 0,
        width: bandWidth,
        height: d.y,
        duration: 0.66667,
        order: i
      }
    }
  }
}
</script>
