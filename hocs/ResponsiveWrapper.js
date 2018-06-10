import responsiveMixin from '../mixins/responsiveMixin'

export default {
  name: 'ResponsiveWrapper',
  extends: responsiveMixin,
  props: {
    paddingTop: {
      type: [Number, Function],
      default: 0
    },
    paddingRight: {
      type: [Number, Function],
      default: 0
    },
    paddingBottom: {
      type: [Number, Function],
      default: 0
    },
    paddingLeft: {
      type: [Number, Function],
      default: 0
    },
    padding: String
  },
  computed: {
    padding_ () {
      if (this.padding == null) return []
      const parsed = this.padding.trim().split(' ')
      if (parsed[1] == null) parsed[1] = parsed[0]
      if (parsed[2] == null) parsed[2] = parsed[0]
      if (parsed[3] == null) parsed[3] = parsed[1]
      return parsed.map((length, i) => {
        if (length.slice(-1) === '%') {
          if (i === 0 || i === 2) {
            return this.height * +length.slice(0, -1) / 100
          } else {
            return this.width * +length.slice(0, -1) / 100
          }
        } else {
          return +length
        }
      })
    },
    paddingTop_ () {
      if (typeof this.paddingTop === 'function') return this.paddingTop()
      return this.padding_[0] || this.paddingTop
    },
    paddingRight_ () {
      if (typeof this.paddingRight === 'function') return this.paddingRight()
      return this.padding_[1] || this.paddingRight
    },
    paddingBottom_ () {
      if (typeof this.paddingBottom === 'function') return this.paddingBottom()
      return this.padding_[2] || this.paddingBottom
    },
    paddingLeft_ () {
      if (typeof this.paddingLeft === 'function') return this.paddingLeft()
      return this.padding_[3] || this.paddingLeft
    }
  },
  render (h) {
    if (this.width == null || this.height == null) return h('svg')
    const $slot = this.$scopedSlots.default({
      width: this.width - this.paddingLeft_ - this.paddingRight_,
      height: this.height - this.paddingTop_ - this.paddingBottom_
    })
    $slot.data.attrs = $slot.data.attrs || {}
    $slot.data.attrs['viewBox'] = `${-this.paddingLeft_} ${-this.paddingTop_} ${this.width} ${this.height}`
    return $slot
  }
}
