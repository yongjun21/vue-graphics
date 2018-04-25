export default {
  functional: true,
  render (h, {data, props}) {
    data.attrs = data.attrs || {}
    Object.assign(data.attrs, props)
    return h('rect', data)
  }
}
