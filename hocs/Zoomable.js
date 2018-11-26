import Vue from 'vue'
import Hammer from 'hammerjs'

const Zoomable = {
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
    maxScale: {
      type: Number,
      default: 2
    },
    lockX: null,
    lockY: null
  },
  data () {
    return {
      scaleX_: 1,
      scaleY_: 1,
      offsetX_: 0,
      offsetY_: 0,
      lastDelta: {
        scale: 1,
        offsetX: 0,
        offsetY: 0
      }
    }
  },
  computed: {
    scaleX: {
      get () {
        return this.$options.synced ? this.$options.synced.scaleX_ : this.scaleX_
      },
      set (value) {
        if (this.lockX != null) return
        value = clamp(value, 1, this.maxScale)
        if (this.$options.synced) this.$options.synced.scaleX_ = value
        else this.scaleX_ = value
      }
    },
    scaleY: {
      get () {
        return this.$options.synced ? this.$options.synced.scaleY_ : this.scaleY_
      },
      set (value) {
        if (this.lockY != null) return
        value = clamp(value, 1, this.maxScale)
        if (this.$options.synced) this.$options.synced.scaleY_ = value
        else this.scaleY_ = value
      }
    },
    offsetX: {
      get () {
        return this.$options.synced ? this.$options.synced.offsetX_ : this.offsetX_
      },
      set (value) {
        if (this.lockX != null) return
        value = clamp(value, this.minOffsetX, 0)
        if (this.$options.synced) this.$options.synced.offsetX_ = value
        else this.offsetX_ = value
      }
    },
    offsetY: {
      get () {
        return this.$options.synced ? this.$options.synced.offsetY_ : this.offsetY_
      },
      set (value) {
        if (this.lockY != null) return
        value = clamp(value, this.minOffsetY, 0)
        if (this.$options.synced) this.$options.synced.offsetY_ = value
        else this.offsetY_ = value
      }
    },
    viewBox () {
      return [
        -this.offsetX / this.scaleX,
        -this.offsetY / this.scaleY,
        this.width / this.scaleX,
        this.height / this.scaleY
      ].join(' ')
    },
    minOffsetX () {
      return -this.width * (this.scaleX - 1)
    },
    minOffsetY () {
      return -this.height * (this.scaleY - 1)
    }
  },
  methods: {
    handlePan (e) {
      const deltaX = e.deltaX - this.lastDelta.offsetX
      const deltaY = e.deltaY - this.lastDelta.offsetY
      this.offsetX = this.offsetX + deltaX
      this.offsetY = this.offsetY + deltaY
      this.lastDelta.offsetX = e.deltaX
      this.lastDelta.offsetY = e.deltaY
    },
    handlePinch (e) {
      const deltaS = e.scale / this.lastDelta.scale

      const {x: thisX, y: thisY} = this.$el.getBoundingClientRect()

      const centerX = e.center.x - thisX
      const centerY = e.center.y - thisY

      const relativeCenterX = (centerX - this.offsetX) / this.scaleX
      const relativeCenterY = (centerY - this.offsetY) / this.scaleY

      console.log('old', this.scaleX, this.scaleY)
      this.scaleX = this.scaleX * deltaS
      this.scaleY = this.scaleY * deltaS
      console.log('new', this.scaleX, this.scaleY)
      this.offsetX = centerX - relativeCenterX * this.scaleX
      this.offsetY = centerY - relativeCenterY * this.scaleY

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
    return h('svg', {
      class: 'vg-zoomable',
      attrs: {
        width: this.width,
        height: this.height,
        viewBox: this.viewBox,
        preserveAspectRatio: 'none'
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
      this.$slots.default
    ])
  }
}

export default Zoomable

export function getSyncedZoomable () {
  const synced = new Vue({
    data: {
      scaleX_: 1,
      scaleY_: 1,
      offsetX_: 0,
      offsetY_: 0
    }
  })
  return Object.assign({synced}, Zoomable)
}

function clamp (value, min, max) {
  return Math.min(Math.max(value, min), max)
}
