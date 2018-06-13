import {mergeClass} from '../util'

export default {
  functional: true,
  render (h, {data}) {
    data.class = mergeClass('vg-bar', data.class)
    return h('rect', data)
  }
}
