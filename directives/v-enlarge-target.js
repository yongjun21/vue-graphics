const mouseEvents = [
  'click',
  'dblclick',
  'mousedown',
  'mouseup',
  'mousemove',
  'mouseover',
  'mouseout',
  'mouseenter',
  'mouseleave',
  'contextmenu'
]

export default {
  bind ($el, binding) {
    const $enlarged = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    $enlarged.setAttribute('stroke-width', binding.value || 9)
    $enlarged.setAttribute('stroke', 'none')
    $enlarged.setAttribute('fill', 'none')
    $enlarged.style.pointerEvents = 'stroke'
    mouseEvents.forEach(type => {
      $enlarged.addEventListener(type, event => {
        const e = new window.Event(type, event)
        $el.dispatchEvent(e)
      })
    })
    $el.$enlarged = $enlarged
  },
  inserted ($el) {
    $el.$enlarged.setAttribute('d', $el.getAttribute('d'))
    $el.parentNode.appendChild($el.$enlarged)
  },
  update ($el) {
    $el.$enlarged.setAttribute('d', $el.getAttribute('d'))
  },
  unbind ($el) {
    $el.$enlarged.parentNode.removeChild($el.$enlarged)
  }
}
