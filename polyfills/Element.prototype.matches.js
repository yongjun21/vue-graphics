polyfill()

function polyfill () {
  if ('matches' in Element.prototype) return
  Element.prototype.matches = Element.prototype.matchesSelector ||
                              Element.prototype.msMatchesSelector
}