export function injectStyle (cssText) {
  const $style = document.createElement('style')
  $style.textContent = cssText
  document.head.appendChild($style)
}
