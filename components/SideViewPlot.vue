<template>
  <animated-group class="vg-plot vg-side-view-plot"
    :watching="features"
    :enter="enterGeom"
    :exit="exitGeom"
    v-on="wrappedListeners">
    <rect v-for="g in geoms" :key="g.key"
      class="vg-feature"
      :class="g.class"
      v-associate="g.feature"
      v-animated="g.attrs">
    </rect>
  </animated-group>
</template>

<script>
import {animationMixin, associateDataMixin} from '../mixins'
import {TransformHelper} from '../helpers'

export default {
  name: 'SideViewPlot',
  mixins: [animationMixin, associateDataMixin],
  props: {
    features: {
      type: Array,
      required: true
    },
    height: {
      type: Function,
      required: true
    },
    bearing: {
      type: Number,
      default: 0
    },
    xScale: {
      type: Function,
      default: v => v
    },
    yScale: {
      type: Function,
      default: v => v
    },
    classed: Function,
    stroke: {
      type: [String, Function]
    },
    fill: {
      type: [String, Function]
    }
  },
  computed: {
    rotate () {
      return new TransformHelper().rotate(this.bearing).apply
    },
    geoms () {
      const {getAttrs, getStyle, classed} = this
      return this.features.map((f, i) => {
        const type = f.geometry.type
        let coordinates = []
        if (type === 'MultiPolygon') {
          coordinates = f.geometry.coordinates
            .reduce((arr, coords) => arr.concat(coords[0]))
        } else if (type === 'Polygon') {
          coordinates = f.geometry.coordinates[0]
        }
        return {
          key: f.key || i,
          class: classed && classed(f),
          attrs: getAttrs(f, coordinates),
          style: getStyle(f),
          feature: f
        }
      })
    },
    enterGeom () {
      return {
        y: this.yScale(0),
        height: 0,
        animation: this.getAnimation(Infinity)
      }
    },
    exitGeom () {
      return {
        y: this.yScale(0),
        height: 0,
        animation: this.getAnimation(-Infinity)
      }
    }
  },
  methods: {
    getAttrs (f, coordinates) {
      const {height, xScale, yScale, rotate} = this
      let x0 = Infinity
      let x1 = -Infinity
      coordinates.forEach(pt => {
        const value = xScale(rotate(pt)[0])
        if (value < x0) x0 = value
        if (value > x1) x1 = value
      })
      const y0 = yScale(0)
      const y1 = yScale(height(f))
      return {
        x: x0,
        y: Math.min(y0, y1),
        width: x1 - x0,
        height: Math.abs(y1 - y0),
        animation: this.getAnimation(0)
      }
    },
    getStyle (f) {
      const {stroke, fill} = this
      return {
        stroke: typeof stroke === 'function' ? stroke(f) : stroke,
        fill: typeof fill === 'function' ? fill(f) : fill
      }
    }
  }
}
</script>
