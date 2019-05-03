<template>
  <animated-group class="vg-annotations" v-on="wrappedListeners" :enter="enter" :exit="exit">
    <animated-text-label v-for="(d, i) in dataView" :key="d.key || i" v-if="hasGeom(d)"
      class="vg-annotation"
      :class="d.class"
      :animation-group="_uid"
      v-bind="getTextGeom(d, i)"
      v-associate="d">
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
    AnimatedTextLabel: makeAnimated({
      functional: true,
      props: ['value', 'formatted'],
      render (h, {data, props}) {
        return h(TextLabel, {
          class: data.class,
          attrs: data.attrs
        }, props.formatted(props.value))
      }
    }, ['x', 'y', 'value'])
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
    v: {
      type: Function,
      required: true
    },
    formatted: {
      type: Function,
      default: v => Math.round(v).toLocaleString()
    },
    enter: Object,
    exit: Object
  },
  methods: {
    getTextGeom (d, i) {
      const geom = this.getGeom(d, i)
      const {x, y} = this
      const getX = typeof x === 'function' ? x : geom => geom[x]
      const getY = typeof y === 'function' ? y : geom => geom[y]
      return Object.assign({
        x: getX(geom),
        y: getY(geom),
        value: this.v(d, i),
        formatted: this.formatted,
        duration: geom.duration,
        order: geom.order
      }, this.$attrs)
    }
  }
}
</script>
