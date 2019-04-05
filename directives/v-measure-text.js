export default {
  inserted: measure,
  componentUpdated: measure
}

function measure ($el, binding) {
  const options = typeof binding.value === 'object'
                ? binding.value
                : {callback: binding.value}
  const target = options.target || 'text'
  const callback = options.callback || console.log
  let max = 0
  Array.prototype.forEach.call($el.querySelectorAll(target), el => {
    if (el.tagName !== 'text') return
    const length = el.getComputedTextLength()
    if (length > max) max = length
  })
  return callback(max)
}
