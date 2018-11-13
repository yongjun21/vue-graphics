import Hammer from 'hammerjs'

export default {
  name: 'Zoomable',
  props: {
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    lockX: null,
    lockY: null,
    minScale: {
      type: Number,
      default: 1
    },
    maxScale: {
      type: Number,
      default: 2
    }
  },
  data () {
    return {
      scale: this.minScale,
      offsetX: 0,
      offsetY: 0,
      lastDelta: {
        scale: 1,
        offsetX: 0,
        offsetY: 0
      }
    }
  },
  computed: {
    viewBox () {
      const scale = this.scale
      return [
        -this.offsetX / scale,
        -this.offsetY / scale,
        this.width / scale,
        this.height / scale
      ].join(' ')
    },
    minOffsetX () {
      if (this.lockX != null) return 0
      return -this.width * (this.scale - 1)
    },
    minOffsetY () {
      if (this.lockY != null) return 0
      return -this.height * (this.scale - 1)
    }
  },
  methods: {
    handlePan (e) {
      const deltaX = e.deltaX - this.lastDelta.offsetX
      const deltaY = e.deltaY - this.lastDelta.offsetY
      this.offsetX = clamp(this.offsetX + deltaX, this.minOffsetX, 0)
      this.offsetY = clamp(this.offsetY + deltaY, this.minOffsetY, 0)
      this.lastDelta.offsetX = e.deltaX
      this.lastDelta.offsetY = e.deltaY
    },
    handlePinch (e) {
      const deltaS = e.scale / this.lastDelta.scale

      const {x: thisX, y: thisY} = this.$el.getBoundingClientRect()

      const centerX = e.center.x - thisX
      const centerY = e.center.y - thisY

      const relativeCenterX = (centerX - this.offsetX) / this.scale
      const relativeCenterY = (centerY - this.offsetY) / this.scale

      this.scale = clamp(this.scale * deltaS, this.minScale, this.maxScale)
      this.offsetX = clamp(centerX - relativeCenterX * this.scale, this.minOffsetX, 0)
      this.offsetY = clamp(centerY - relativeCenterY * this.scale, this.minOffsetY, 0)

      this.lastDelta.scale = e.scale
    }
  },
  mounted () {
    this.$el.addEventListener('touchmove',
      e => e.preventDefault(), {passive: false})

    const manager = new Hammer.Manager(this.$el, {
      recognizers: [
        [Hammer.Pinch, {enable: true}],
        [Hammer.Pan, {enable: true}]
      ]
    })

    manager.on('pinch', this.handlePinch)
    manager.on('pan', this.handlePan)
    manager.on('pinchend', () => {
      this.lastDelta.scale = 1
    })
    manager.on('panend', () => {
      this.lastDelta.offsetX = 0
      this.lastDelta.offsetY = 0
    })
  },
  render (h) {
    const {scale, offsetX, offsetY} = this
    let $slot
    if (this.$scopedSlots.default) {
      $slot = this.$scopedSlots.default({scale, offsetX, offsetY})
    } else if (this.$slots.default) {
      $slot = this.$slots.default
    }
    return h('svg', {
      class: 'vg-zoomable',
      attrs: {
        width: this.width,
        height: this.height,
        viewBox: this.viewBox
      }
    }, [
      h('rect', {
        attrs: {
          width: this.width,
          height: this.height,
          fill: 'none'
        },
        style: {'pointer-events': 'all'}
      }),
      $slot
    ])
  }
}

function clamp (value, min, max) {
  return Math.min(Math.max(value, min), max)
}
