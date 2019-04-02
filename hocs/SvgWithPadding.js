export default {
  name: 'SvgWithPadding',
  functional: true,
  props: {
    width: {
      type: Number,
      default: 800
    },
    height: {
      type: Number,
      default: 500
    },
    paddingTop: [String, Number],
    paddingRight: [String, Number],
    paddingBottom: [String, Number],
    paddingLeft: [String, Number],
    padding: {
      type: String,
      default: '10%'
    }
  },
  render (h, {data, props, scopedSlots}) {
    const [paddingTop, paddingRight, paddingBottom, paddingLeft] = getPadding(props)

    const contentBox = {
      width: props.width - paddingLeft - paddingRight,
      height: props.height - paddingTop - paddingBottom,
      paddingLeft,
      paddingTop,
      paddingRight,
      paddingBottom
    }

    const viewBox = [
      -paddingLeft,
      -paddingTop,
      props.width,
      props.height
    ].join(' ')

    data.attrs = data.attrs || {}
    data.attrs.viewBox = viewBox

    return h('svg', data, [
      scopedSlots.default(contentBox)
    ])
  }
}

function getPadding (props) {
  const parsed = props.padding.trim().split(' ')
  if (parsed[1] == null) parsed[1] = parsed[0]
  if (parsed[2] == null) parsed[2] = parsed[0]
  if (parsed[3] == null) parsed[3] = parsed[1]
  if (props.paddingTop != null) parsed[0] = props.paddingTop
  if (props.paddingRight != null) parsed[1] = props.paddingRight
  if (props.paddingBottom != null) parsed[2] = props.paddingBottom
  if (props.paddingLeft != null) parsed[3] = props.paddingLeft
  return parsed.map((length, i) => {
    if (typeof length === 'string' && length.slice(-1) === '%') {
      return props.width * Number(length.slice(0, -1)) / 100
    } else {
      return Number(length)
    }
  })
}
