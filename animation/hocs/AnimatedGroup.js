import {_ANIMATE_} from '../shared'

export default {
  functional: true,
  props: {
    enter: Object,
    exit: Object
  },
  render (h, {props, data, scopedSlots}) {
    const $children = scopedSlots.default && scopedSlots.default()

    const listeners = {}
    if (props.enter) {
      listeners.enter = function (el, done) {
        if (!el[_ANIMATE_]) return done()
        el[_ANIMATE_](props.enter, done, true)
      }
    }
    if (props.exit) {
      listeners.leave = function (el, done) {
        if (!el[_ANIMATE_]) return done()
        el[_ANIMATE_](props.exit, done, false)
      }
    }

    data.props = {tag: 'g', appear: true}
    data.on = Object.assign(data.on || {}, listeners)

    return h('transition-group', data, $children)
  }
}
