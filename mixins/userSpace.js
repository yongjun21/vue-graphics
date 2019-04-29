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
    $_bbox () {
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
    $_translate () {
      const bbox = this.$_bbox
      const originAt = this.originAt || 'xMinYMin'
      if (Array.isArray(originAt)) {
        return [
          (1 - originAt[0]) * bbox[0] + originAt[0] * bbox[2],
          (1 - originAt[1]) * bbox[1] + originAt[1] * bbox[3]
        ]
      }
      const pattern = /x(Min|Mid|Max)Y(Min|Mid|Max)/
      const [, xAlign, yAlign] = originAt.match(pattern)
      const xTranslate = xAlign === 'Min' ? bbox[0]
                       : xAlign === 'Max' ? bbox[2]
                       : (bbox[0] + bbox[2]) / 2
      const yTranslate = yAlign === 'Min' ? bbox[1]
                       : yAlign === 'Max' ? bbox[3]
                       : (bbox[1] + bbox[3]) / 2
      return [xTranslate, yTranslate]
    },
    xRange () {
      return [
        this.$_bbox[0] - this.$_translate[0],
        this.$_bbox[2] - this.$_translate[0]
      ]
    },
    yRange () {
      return [
        this.$_bbox[1] - this.$_translate[1],
        this.$_bbox[3] - this.$_translate[1]
      ]
    },
    transform () {
      const t = new TransformHelper()
      t.translate(this.$_translate[0], this.$_translate[1])
      return this.layout ? t.chain(this.layout) : t
    }
  }
}
