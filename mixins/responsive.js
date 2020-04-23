import {frameRateLimited} from '../util'

export default {
  data () {
    return {
      width: null,
      height: null
    }
  },
  mounted () {
    this.$_resize()
    this.$_resize = frameRateLimited(this.$_resize)
    window.addEventListener('resize', this.$_resize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.$_resize)
  },
  methods: {
    $_resize () {
      const {width, height} = this.$el.getBoundingClientRect()
      this.width = width
      this.height = height
    }
  }
}
