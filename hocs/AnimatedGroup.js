import {_ANIMATE_} from '../animation'

export default {
  functional: true,
  props: {
    enter: Object,
    exit: Object
  },
  render (h, {props, data, scopedSlots}) {
    const $children = scopedSlots.default && scopedSlots.default()
    const on = {}
    if (props.enter) {
      on.enter = function (el, done) {
        if (!el[_ANIMATE_]) return done()
        const vars = Object.assign({
          duration: 0.66667,
          order: Infinity
        }, props.enter)
        el[_ANIMATE_](vars, done, true)
      }
    }

    if (props.exit) {
      on.exit = function (el, done) {
        if (!props.exit || !el[_ANIMATE_]) return done()
        const vars = Object.assign({
          duration: 0.66667,
          order: -Infinity,
          leaving: true
        }, props.exit)
        el[_ANIMATE_](vars, done, false)
      }
    }

    return h('transition-group', {
      class: data.class,
      props: {
        tag: 'g',
        appear: true
      },
      on: Object.assign(on, data.on)
    }, $children)
  }
}
