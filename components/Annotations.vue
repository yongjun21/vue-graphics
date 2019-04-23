<template>
  <animated-group class="vg-annotations" v-on="wrappedListeners" :enter="enter">
    <animated-text-label v-for="(d, i) in dataView" :key="d.key || i" v-if="hasGeom(d)"
      class="vg-annotation"
      :class="d.class"
      v-associate="d"
      v-bind="getTextGeom(d, i)">
      {{formatted(d)}}
    </animated-text-label>
  </animated-group>
</template>

<script>
import TextLabel from '../elements/TextLabel'
import {animationMixin, associateDataMixin} from '../mixins'
import {makeAnimated} from '../animation'

export default {
  name: 'Annotations',
  components: {
    AnimatedTextLabel: makeAnimated(TextLabel, ['x', 'y'])
  },
  mixins: [animationMixin, associateDataMixin],
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
    },
    enter: Object
  },
  methods: {
    getTextGeom (d, i) {
      const geom = this.getGeom(d, i)
      const {x, y} = this
      const xValue = typeof x === 'function' ? x(geom) : geom[x]
      const yValue = typeof y === 'function' ? y(geom) : geom[y]
      return Object.assign({
        x: xValue,
        y: yValue,
        duration: geom.duration,
        order: geom.order
      }, this.$attrs)
    }
  }
}
</script>
