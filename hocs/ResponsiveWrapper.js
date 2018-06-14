import responsiveMixin from '../mixins/responsiveMixin'
import {mergeClass} from '../util'

export default {
  name: 'ResponsiveWrapper',
  extends: responsiveMixin,
  props: {
    paddingTop: [Number, Function],
    paddingRight: [Number, Function],
    paddingBottom: [Number, Function],
    paddingLeft: [Number, Function],
    padding: {
      type: String,
      default: ''
    }
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
      return this.paddingTop != null ? this.paddingTop : this.padding_[0]
    },
    paddingRight_ () {
      if (typeof this.paddingRight === 'function') return this.paddingRight()
      return this.paddingRight != null ? this.paddingRight : this.padding_[1]
    },
    paddingBottom_ () {
      if (typeof this.paddingBottom === 'function') return this.paddingBottom()
      return this.paddingBottom != null ? this.paddingBottom : this.padding_[2] 
    },
    paddingLeft_ () {
      if (typeof this.paddingLeft === 'function') return this.paddingLeft()
      return this.paddingLeft != null ? this.paddingLeft : this.padding_[3]
    }
  },
  render (h) {
    if (this.width == null || this.height == null) return h('svg')
    let $slot
    if (this.$scopedSlots.default) {
      $slot = this.$scopedSlots.default({
        width: this.width - this.paddingLeft_ - this.paddingRight_,
        height: this.height - this.paddingTop_ - this.paddingBottom_
      })
    } else if (this.$slots.default) {
      $slot = this.$slots.default[0]
    }
    if (!$slot || !$slot.tag) return h('svg')
    $slot.data.class = mergeClass('vg-responsive', $slot.data.class)
    $slot.data.attrs = $slot.data.attrs || {}
    $slot.data.attrs['viewBox'] = `${-this.paddingLeft_} ${-this.paddingTop_} ${this.width} ${this.height}`
    return $slot
  }
}
