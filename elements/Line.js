export default {
  functional: true,
  render (h, {data}) {
    data.attrs = data.attrs || {}
    Object.assign(data.attrs, {'fill': 'none'})
    return h('path', data)
  }
}
