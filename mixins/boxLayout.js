export default {
  props: {
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    },
    width: Number,
    height: Number
  },
  computed: {
    xRange () {
      return this.width && [this.x, this.x + this.width]
    },
    yRange () {
      return this.height && [this.y, this.y + this.height]
    }
  }
}
