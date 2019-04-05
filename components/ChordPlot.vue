<template>
  <g class="vg-plot vg-chord-plot" v-on="wrappedListeners">
    <path v-for="(d, i) in dataView" :key="d.key" v-if="hasGeom(d)"
      class="vg-chord"
      :class="d.class"
      :d="getGeom(d)"
      v-associate="d"
      v-draw:[_uid]="{duration: 0.66667, order: i}">
    </path>
  </g>
</template>

<script>
import {animationMixin, associateDataMixin} from '../mixins'
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
    r: {
      type: Number,
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
    getGeom ({o, d}) {
      const {aScale, rScale, r} = this
      const oXY = polar2xy([aScale(o.a), rScale(r)])
      const dXY = polar2xy([aScale(d.a), rScale(r)])
      const p = path()
      p.moveTo(...oXY)
      p.quadraticCurveTo(0, 0, ...dXY)
      return p.toString()
    },
    hasGeom ({o, d}) {
      return this.aScale(o.a) != null && this.aScale(d.a) != null
    }
  }
}
</script>
