export function mapRadialToCartesian (a, radius, center = [0, 0]) {
  return [
    Math.round(Math.cos(a) * radius + center[0]),
    Math.round(Math.sin(a) * radius + center[1])
  ]
}

export function injectStyle (cssText) {
  const $style = document.createElement('style')
  $style.textContent = cssText
  document.head.appendChild($style)
}
