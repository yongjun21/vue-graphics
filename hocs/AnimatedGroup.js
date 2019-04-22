import {_ANIMATE_} from '../animation'

export default {
  functional: true,
  props: {
    enter: Object,
    exit: Object
  },
  render (h, {props, data, children}) {
    return h('transition-group', {
      class: data.class,
      props: {
        tag: 'g',
        appear: true,
        css: false
      },
      on: {
        enter (el, done) {
          if (!el[_ANIMATE_]) return
          const binding = {
            value: Object.assign({
              duration: 0.66667,
              order: Infinity
            }, props.enter)
          }
          el[_ANIMATE_](binding, done, true)
        },
        leave (el, done) {
          if (!el[_ANIMATE_]) return
          const binding = {
            value: Object.assign({
              duration: 0.66667,
              order: -Infinity
            }, props.exit)
          }
          el[_ANIMATE_](binding, done, false)
        }
      }
    }, children)
  }
}
