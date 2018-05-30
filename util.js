let $path

export function getPathLength (d) {
  $path = $path || document.createElementNS('http://www.w3.org/2000/svg', 'path')
  $path.setAttribute('d', d)
  return Math.ceil($path.getTotalLength())
}

export function mapRadialToCartesian (a, radius, center = [0, 0]) {
  return [
    Math.round(Math.cos(a) * radius + center[0]),
    Math.round(Math.sin(a) * radius + center[1])
  ]
}

export function mergeClass (...classes) {
  return classes.reduce((obj, cl) => {
    if (typeof cl === 'string') {
      cl.split(' ').forEach(c => {
        obj[c] = true
      })
    } else if (typeof cl === 'object') {
      Object.assign(obj, cl)
    }
    return obj
  }, {})
}

const hashCollection = {}

export function uniqueHash () {
  let hash
  do {
    hash = Math.random().toString(36).slice(2, 7)
  } while (hash in hashCollection)
  hashCollection[hash] = true
  return hash
}

export function injectStyle (cssText) {
  const $style = document.createElement('style')
  $style.textContent = cssText
  document.head.appendChild($style)
}
