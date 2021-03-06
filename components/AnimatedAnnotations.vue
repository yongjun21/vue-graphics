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
        return h(TextLabel, data, props.formatted(props.value))
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
    anchor: [Function, String],
    formatted: {
      type: Function,
      default: v => v ? Math.round(v).toLocaleString() : ''
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
      const {x, y, anchor} = this
      const xValue = typeof x === 'function' ? x(geom) : geom[x]
      const yValue = typeof y === 'function' ? y(geom) : geom[y]
      const anchorValue = typeof y === 'function' ? anchor(geom) : anchor
      return Object.assign({
        x: xValue,
        y: yValue,
        anchor: anchorValue,
        value: this.v(d, i),
        formatted: this.formatted,
        animation: this.getAnimation(i)
      }, this.$attrs)
    }
  }
}
</script>
