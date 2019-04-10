const _CLONE_ = Symbol('clone')

export default {
  inserted ($el, binding) {
    const $clone = $el.cloneNode()
    $el.setAttribute('stroke-width', binding.value || 9)
    $el.setAttribute('class', 'vg-enlarged')
    $el.setAttribute('stroke', 'none')
    $el.setAttribute('fill', 'none')
    $el.style.pointerEvents = 'stroke'
    $clone.style.pointerEvents = 'none'
    $el.parentNode.appendChild($clone)
    $el[_CLONE_] = $clone
  },
  update ($el) {
    const $clone = $el[_CLONE_]
    $clone.setAttribute('d', $el.getAttribute('d'))
    $clone.setAttribute('stroke-dasharray', $el.getAttribute('stroke-dasharray'))
    $clone.setAttribute('stroke-dashoffset', $el.getAttribute('stroke-dashoffset'))
  },
  unbind ($el) {
    const $clone = $el[_CLONE_]
    $clone.parentNode.removeChild($clone)
  }
}
