import responsiveMixin from '../mixins/responsive'

export default {
  name: 'ResponsiveSvg',
  extends: responsiveMixin,
  props: {
    paddingTop: [String, Number],
    paddingRight: [String, Number],
    paddingBottom: [String, Number],
    paddingLeft: [String, Number],
    padding: {
      type: String,
      default: '10%'
    }
  },
  computed: {
    $_padding () {
      const parsed = this.padding.trim().split(' ')
      if (parsed[1] == null) parsed[1] = parsed[0]
      if (parsed[2] == null) parsed[2] = parsed[0]
      if (parsed[3] == null) parsed[3] = parsed[1]
      if (this.paddingTop != null) parsed[0] = this.paddingTop
      if (this.paddingRight != null) parsed[1] = this.paddingRight
      if (this.paddingBottom != null) parsed[2] = this.paddingBottom
      if (this.paddingLeft != null) parsed[3] = this.paddingLeft
      return parsed.map((length, i) => {
        if (typeof length === 'string' && length.slice(-1) === '%') {
          return this.width * Number(length.slice(0, -1)) / 100
        } else {
          return Number(length)
        }
      })
    }
  },
  render (h) {
    if (this.width == null || this.height == null) return h('svg')
    const [paddingTop, paddingRight, paddingBottom, paddingLeft] = this.$_padding

    const contentBox = {
      width: this.width - paddingLeft - paddingRight,
      height: this.height - paddingTop - paddingBottom,
      paddingLeft,
      paddingTop,
      paddingRight,
      paddingBottom
    }

    const viewBox = [
      -paddingLeft,
      -paddingTop,
      this.width,
      this.height
    ].join(' ')

    const $slot = this.$scopedSlots.default

    return h('svg', {class: 'vg-responsive', attrs: {viewBox}}, $slot && $slot(contentBox))
  }
}
