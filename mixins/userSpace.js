import {TransformHelper} from '../helpers'

export default {
  name: 'UserSpace',
  props: {
    left: {
      type: Number,
      default: 0
    },
    top: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 800
    },
    height: {
      type: Number,
      default: 500
    }
  },
  computed: {
    bbox () {
      const {left, top, width, height} = this
      const t = this.layout || new TransformHelper()
      const corners = [
        t.unapply([left, top]),
        t.unapply([left + width, top]),
        t.unapply([left + width, top + height]),
        t.unapply([left, top + height])
      ]
      return [
        Math.min(...corners.map(c => c[0])),
        Math.min(...corners.map(c => c[1])),
        Math.max(...corners.map(c => c[0])),
        Math.max(...corners.map(c => c[1]))
      ]
    },
    xScale () {
      const {bbox, xRange} = this
      const scale = (bbox[2] - bbox[0]) / (xRange[1] - xRange[0])
      return x => Math.round(scale * x)
    },
    yScale () {
      const {bbox, yRange} = this
      const scale = (bbox[3] - bbox[1]) / (yRange[1] - yRange[0])
      return y => Math.round(scale * y)
    },
    transform () {
      const {layout, bbox, xScale, yScale, xRange, yRange} = this
      const [left, top] = [xScale(xRange[0]), yScale(yRange[0])]
      const t = new TransformHelper().translate(bbox[0] - left, bbox[1] - top)
      return layout ? t.chain(layout) : t
    }
  }
}
