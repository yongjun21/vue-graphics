<template>
  <transition-group tag="g" class="vg-plot vg-top-view-plot" v-on="wrappedListeners">
    <component :is="g.type" v-for="g in geoms" :key="g.key"
      class="vg-feature"
      :class="g.class"
      v-associate="g.feature"
      v-bind="g.attrs">
    </component>
  </transition-group>
</template>

<script>
import {associateDataMixin} from '../mixins'
import {TransformHelper} from '../helpers'

export default {
  name: 'TopViewPlot',
  mixins: [associateDataMixin],
  props: {
    features: {
      type: Array,
      required: true
    },
    xScale: {
      type: Function,
      default: v => v
    },
    yScale: {
      type: Function,
      default: v => v
    },
    bearing: {
      type: Number,
      default: 0
    },
    classed: Function,
    stroke: {
      type: [String, Function]
    },
    fill: {
      type: [String, Function]
    },
    r: {
      type: [Number, Function],
      default: 3
    }
  },
  computed: {
    rotate () {
      return new TransformHelper().rotate(this.bearing).apply
    },
    geoms () {
      const {getType, getClass, getAttrs} = this
      const geoms = []
      this.features.forEach((f, i) => {
        let type = f.geometry.type
        if (type.startsWith('Multi')) {
          type = type.slice(5)
          f.geometry.coordinates.forEach((coords, j) => {
            geoms.push({
              key: (f.key || i) + '-' + j,
              type: getType(f, type),
              class: getClass(f, type),
              attrs: getAttrs(f, type, coords),
              feature: f
            })
          })
        } else {
          geoms.push({
            key: f.key || i,
            type: getType(f, type),
            class: getClass(f, type),
            attrs: getAttrs(f, type, f.geometry.coordinates),
            feature: f
          })
        }
      })
      return geoms
    }
  },
  methods: {
    getType (f, type) {
      return type === 'Point' ? 'circle'
           : type === 'LineString' ? 'polyline'
           : type === 'Polygon' ? 'polygon'
           : null
    },
    getClass (f, type) {
      const {classed} = this
      const typeClass = type === 'Point' ? 'vg-point'
                      : type === 'LineString' ? 'vg-line'
                      : type === 'Polygon' ? 'vg-polygon'
                      : null
      return [typeClass, classed && classed(f)]
    },
    getAttrs (f, type, coordinates) {
      const {xScale, yScale, stroke, fill, r, rotate} = this
      switch (type) {
        case 'Point':
          const [x, y] = rotate(coordinates)
          return {
            cx: xScale(x),
            cy: yScale(y),
            r: typeof r === 'function' ? r(f) : r
          }
        case 'LineString':
          return {
            points: coordinates.map(pt => {
              const [x, y] = rotate(pt)
              return xScale(x) + ',' + yScale(y)
            }).join(' '),
            stroke: typeof stroke === 'function' ? stroke(f) : stroke
          }
        case 'Polygon':
          return {
            points: coordinates[0].map(pt => {
              const [x, y] = rotate(pt)
              return xScale(x) + ',' + yScale(y)
            }).join(' '),
            stroke: typeof stroke === 'function' ? stroke(f) : stroke,
            fill: typeof fill === 'function' ? fill(f) : fill
          }
        default:
          return {}
      }
    }
  }
}
</script>
