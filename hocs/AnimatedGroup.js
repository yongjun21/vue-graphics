import {_ANIMATE_} from '../animation'

export default {
  functional: true,
  props: {
    enter: Object,
    exit: Object
  },
  render (h, {props, data, scopedSlots}) {
    const $children = scopedSlots.default && scopedSlots.default()

    const listeners = {
      enter: props.enter && function (el, done) {
        if (!el[_ANIMATE_]) return done()
        el[_ANIMATE_](props.enter, done, true)
      },
      leave: props.exit && function (el, done) {
        if (!el[_ANIMATE_]) return done()
        el[_ANIMATE_](props.exit, done, false)
      }
    }

    return h('transition-group', {
      class: data.class,
      props: {
        tag: 'g',
        appear: true
      },
      on: Object.assign(listeners, data.on)
    }, $children)
  }
}
