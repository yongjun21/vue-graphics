import {frameRateLimited} from '../util'

export default {
  data () {
    return {
      width: null,
      height: null
    }
  },
  mounted () {
    this.vgResize()
    this.vgResize = frameRateLimited(this.vgResize)
    window.addEventListener('resize', this.vgResize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.vgResize)
  },
  methods: {
    vgResize () {
      const $ref = this.$options.vgRef.call(this)
      const {width, height} = $ref.getBoundingClientRect()
      this.width = width
      this.height = height
    }
  },
  vgRef () {
    return this.$el
  },
  track (accessor) {
    this.vgRef = typeof accessor === 'string' ? function () { return this.$refs[accessor] } : accessor
    return this
  }
}
