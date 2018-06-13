import {mergeClass} from '../util'

export default {
  functional: true,
  render (h, {data}) {
    data.class = mergeClass('vg-line', data.class)
    data.attrs = data.attrs || {}
    data.attrs.fill = 'none'
    return h('path', data)
  }
}
