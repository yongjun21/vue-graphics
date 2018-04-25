export default {
  functional: true,
  render (h, {data, props}) {
    data.attrs = data.attrs || {}
    Object.assign(data.attrs, {'fill': 'none'}, props)
    return h('path', data)
  }
}
