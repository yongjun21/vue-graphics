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
    // transform () {
    //   const {xRange, yRange, baseTransform} = this
    //   const t = baseTransform.clone()
    //   const corners = [
    //     t.apply([xRange[0], yRange[0]]),
    //     t.apply([xRange[1], yRange[0]]),
    //     t.apply([xRange[1], yRange[1]]),
    //     t.apply([xRange[0], yRange[1]])
    //   ]
    //   const bbox = [
    //     Math.min(...corners.map(c => c[0])),
    //     Math.min(...corners.map(c => c[1])),
    //     Math.max(...corners.map(c => c[0])),
    //     Math.max(...corners.map(c => c[1]))
    //   ]
    //   t.translate(this.left - bbox[0], this.top - bbox[1])
    //   t.scale(
    //     this.width / (bbox[2] - bbox[0]),
    //     this.height / (bbox[3] - bbox[1]),
    //     [this.left, this.top]
    //   )
    //   return t
    // },
    bbox () {
      const {left, top, width, height} = this
      const t = this.transform || new TransformHelper()
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
      const X0 = xRange[0] - bbox[0] / scale
      return (x, x0 = X0) => Math.round(scale * (x - x0))
    },
    yScale () {
      const {bbox, yRange} = this
      const scale = (bbox[3] - bbox[1]) / (yRange[1] - yRange[0])
      const Y0 = yRange[0] - bbox[1] / scale
      return (y, y0 = Y0) => Math.round(scale * (y - y0))
    }
  }
}
