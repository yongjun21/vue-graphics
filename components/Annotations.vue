<template>
  <animated-group class="vg-annotations"
    :watching="dataView"
    :enter="enterGeom"
    :exit="exitGeom"
    :appear="enterGeom"
    v-on="wrappedListeners">
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
    enter: Object,
    exit: Object
  },
  computed: {
    enterGeom () {
      return this.enter && Object.assign({
        animation: this.getAnimation(Infinity)
      }, this.enter)
    },
    exitGeom () {
      return this.exit && Object.assign({
        animation: this.getAnimation(-Infinity)
      }, this.exit)
    }
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
        animation: this.getAnimation(i)
      }, this.$attrs)
    }
  }
}
</script>
