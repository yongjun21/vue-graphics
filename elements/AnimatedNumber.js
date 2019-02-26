import {makeAnimated} from '../animation'

export default makeAnimated({
  functional: true,
  render (h, {data, attrs}) {
    return h('span', data, Math.round(attrs.value.toLocaleString()))
  }
})
