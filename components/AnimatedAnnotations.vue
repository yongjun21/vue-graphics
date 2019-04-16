<template>
  <g class="vg-annotations" v-on="wrappedListeners">
    <text-label v-for="d in dataView" :key="d.key" v-if="hasGeom(d)"
      class="vg-annotation"
      :class="d.class"
      :animated="getTextGeom(d)"
      v-bind="$attrs">
      <animated-number :animated="getNumberGeom(d)" v-associate="d"></animated-number>
    </text-label>
  </g>
</template>

<script>
import TextLabel from '../elements/TextLabel'
import {associateDataMixin} from '../mixins'
import {makeAnimated} from '../animation'

export default {
  name: 'Annotations',
  components: {
    TextLabel: makeAnimated(TextLabel),
    AnimatedNumber: makeAnimated({
      functional: true,
      props: ['value'],
      render (h, {data, props}) {
        return h('tspan', data, Math.round(props.value.toLocaleString()))
      }
    })
  },
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
    v: {
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
    },
    getNumberGeom (d) {
      const geom = this.getGeom(d)
      return {
        value: this.v(d),
        duration: geom.duration,
        order: geom.order
      }
    }
  }
}
</script>
