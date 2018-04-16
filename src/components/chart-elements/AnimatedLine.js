export default {
  name: 'AnimatedLine',
  props: {
    attrs: Object
  },
  data () {
    return {
      length: null
    }
  },
  methods: {
    showHighlight () {
      this.length = this.$refs.base.getTotalLength()
    },
    hidehighlight () {
      window.setTimeout(() => {
        this.length = null
      }, 200)
    }
  },
  render (h) {
    const $base = h('path', {
      key: 'base',
      ref: 'base',
      attrs: this.attrs,
      on: {
        mouseover: this.showHighlight,
        mouseout: this.hidehighlight
      }
    })
    const $highlight = this.length && h('path', {
      key: 'highlight',
      class: {highlight: true},
      attrs: Object.assign({
        'stroke-dasharray': this.length,
        'stroke-dashoffset': this.length
      }, this.attrs)
    })
    return h('g', [$base, $highlight])
  }
}
