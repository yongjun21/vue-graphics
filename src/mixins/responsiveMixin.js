export default {
  data () {
    return {
      _resizing: false,
      width: null,
      height: null
    }
  },
  computed: {
    sized () {
      return this.width != null && this.height != null
    }
  },
  methods: {
    _resize () {
      if (this._resizing) return
      this._resizing = true
      window.requestAnimationFrame(() => {
        const {width, height} = this.$el.getBoundingClientRect()
        this.width = width
        this.height = height
        this._resizing = false
      })
    }
  },
  mounted () {
    this._resize()
    window.addEventListener('resize', this._resize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this._resize)
  }
}
