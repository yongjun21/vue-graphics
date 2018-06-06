import {frameRateLimited} from '../util'

export default {
  data () {
    return {
      width: null,
      height: null
    }
  },
  methods: {
    _resize: frameRateLimited(function () {
      const {width, height} = this.$el.getBoundingClientRect()
      this.width = width
      this.height = height
    })
  },
  mounted () {
    this._resize()
    window.addEventListener('resize', this._resize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this._resize)
  }
}
