<template>
  <g class="vg-annotations" v-on="wrappedListeners">
    <text-label v-for="d in dataView" :key="d.key" v-if="hasGeom(d)"
      class="vg-annotation"
      :class="d.class"
      v-associate="d"
      :animated="getTextGeom(d)"
      v-bind="$attrs">
      {{formatted(d)}}
    </text-label>
  </g>
</template>

<script>
import TextLabel from '../elements/TextLabel'
import {associateDataMixin} from '../mixins'
import {makeAnimated} from '../animation'

export default {
  name: 'Annotations',
  components: {TextLabel: makeAnimated(TextLabel)},
  mixins: [associateDataMixin],
  inheritAttrs: false,
  props: {
    dataView: {
      type: Array,
      required: true
    },
    getGeom: {
      type: Function,
      required: true
    },
    hasGeom: {
      type: Function,
      required: true
    },
    x: {
      type: [Function, String, Number],
      required: true
    },
    y: {
      type: [Function, String, Number],
      required: true
    },
    formatted: {
      type: Function,
      required: true
    }
  },
  methods: {
    getTextGeom (d) {
      const geom = this.getGeom(d)
      const {x, y} = this
      const getX = typeof x === 'function' ? x : geom => geom[x]
      const getY = typeof y === 'function' ? y : geom => geom[y]
      return {
        x: getX(geom),
        y: getY(geom),
        duration: geom.duration,
        order: geom.order
      }
    }
  }
}
</script>
