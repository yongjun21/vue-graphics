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
    transform () {
      const {xRange, yRange, baseTransform} = this
      const t = baseTransform.clone()
      const corners = [
        t.apply([xRange[0], yRange[0]]),
        t.apply([xRange[1], yRange[0]]),
        t.apply([xRange[1], yRange[1]]),
        t.apply([xRange[0], yRange[1]])
      ]
      const bbox = [
        Math.min(...corners.map(c => c[0])),
        Math.min(...corners.map(c => c[1])),
        Math.max(...corners.map(c => c[0])),
        Math.max(...corners.map(c => c[1]))
      ]
      t.translate(this.left - bbox[0], this.top - bbox[1])
      t.scale(
        this.width / (bbox[2] - bbox[0]),
        this.height / (bbox[3] - bbox[1]),
        [this.left, this.top]
      )
      return t
    }
  }
}
