<template>
  <g class="vg-plot vg-chord-plot" v-on="wrappedListeners">
    <path v-for="(d, i) in dataView" :key="d.key || i" v-if="hasGeom(d)"
      class="vg-chord"
      :class="d.class"
      v-bind="getGeom(d)"
      v-associate="d"
      v-draw="getAnimation(i)">
    </path>
  </g>
</template>

<script>
import {animationMixin, associateDataMixin} from '../mixins'
import {queueAnimations, flushAnimations} from '../animation'
import {path} from 'd3-path'
import {polar2xy} from '../util'

export default {
  name: 'ChordPlot',
  mixins: [animationMixin, associateDataMixin],
  inheritAttrs: false,
  props: {
    dataView: {
      type: Array,
      required: true
    },
    aScale: {
      type: Function,
      default: v => v
    },
    rScale: {
      type: Function,
      default: v => v
    }
  },
  methods: {
    getGeom (d) {
      const {aScale, rScale} = this
      const oXY = polar2xy([aScale(d.a1), rScale(d.r)])
      const dXY = polar2xy([aScale(d.a2), rScale(d.r)])
      const p = path()
      p.moveTo(...oXY)
      p.quadraticCurveTo(0, 0, ...dXY)
      return {d: p.toString()}
    },
    hasGeom (d) {
      return this.aScale(d.a1) != null && this.aScale(d.a2) != null
    }
  },
  created () {
    queueAnimations(this.animationGroup || this._uid)
    this.$nextTick(function () {
      const tweens = flushAnimations(this.animationGroup || this._uid)
      if (tweens.length === 0) return
      new TimelineLite({tweens, stagger: this.animationStagger}) // eslint-disable-line
    })
  }
}
</script>
