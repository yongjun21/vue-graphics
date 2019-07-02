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
      const origin = getOrigin(this.originAt, left, top, left + width, top + height)
      t.params.e = origin[0]
      t.params.f = origin[1]

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
      const xRange = [bbox[0] * dc.scaleX, bbox[2] * dc.scaleX]
      const yRange = [bbox[1] * dc.scaleY, bbox[3] * dc.scaleY]
      const transform = new TransformHelper()
        .skewX(dc.skewX)
        .rotate(dc.rotate)
        .translate(dc.translateX, dc.translateY)
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
