import {TransformHelper} from '../helpers'

export default {
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
    $_transformed () {
      const {left, top, width, height} = this
      const t = this.layout || new TransformHelper()
      const origin = t.unapply(getOrigin(this.originAt, left, top, left + width, top + height))
      const corners = [
        t.unapply([left, top]),
        t.unapply([left + width, top]),
        t.unapply([left + width, top + height]),
        t.unapply([left, top + height])
      ]

      const bbox = [
        Math.min(...corners.map(c => c[0])),
        Math.min(...corners.map(c => c[1])),
        Math.max(...corners.map(c => c[0])),
        Math.max(...corners.map(c => c[1]))
      ]

      const dc = t.decompose()
      const {e: translateX, f: translateY} = new TransformHelper()
        .skewX(dc.skewX)
        .rotate(dc.rotate)
        .translate(dc.translateX, dc.translateY)
        .rotate(-dc.rotate)
        .skewX(-dc.skewX)
        .params

      const xRange = [
        bbox[0] * dc.scaleX + translateX + origin[0],
        bbox[2] * dc.scaleX + translateX + origin[0]
      ]

      const yRange = [
        bbox[1] * dc.scaleY + translateY + origin[1],
        bbox[3] * dc.scaleY + translateY + origin[1]
      ]

      const transform = new TransformHelper()
        .translate(-origin[0], -origin[1])
        .skewX(dc.skewX)
        .rotate(dc.rotate)

      return {xRange, yRange, transform}
    },
    xRange () {
      return this.$_transformed.xRange
    },
    yRange () {
      return this.$_transformed.yRange
    },
    transform () {
      return this.$_transformed.transform
    }
  }
}

function getOrigin (originAt, xMin, yMin, xMax, yMax) {
  originAt = originAt || 'xMinYMin'
  let xt, yt
  if (Array.isArray(originAt)) {
    [xt, yt] = originAt
  }
  const pattern = /x(Min|Mid|Max)Y(Min|Mid|Max)/
  const [, xAlign, yAlign] = originAt.match(pattern)
  xt = xAlign === 'Min' ? 0
     : xAlign === 'Max' ? 1
     : 0.5
  yt = yAlign === 'Min' ? 0
     : yAlign === 'Max' ? 1
     : 0.5
  return [
    (1 - xt) * xMin + xt * xMax,
    (1 - yt) * yMin + yt * yMax
  ]
}
