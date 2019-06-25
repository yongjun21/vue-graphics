import './polyfills/Element.prototype.matches'

// for testing
export function createSVGElement (tag) {
  return document.createElementNS('http://www.w3.org/2000/svg', tag)
}

let dummy = 0
export function getUid (prefix) {
  return prefix + (dummy++).toString(36)
}

export function polar2xy ([angle, radius]) {
  const rad = angle * Math.PI / 180
  return [
    Math.round(Math.sin(rad) * radius),
    -Math.round(Math.cos(rad) * radius)
  ]
}

export function wrapListeners ($listeners, getData, selector) {
  const wrapped = {}
  Object.keys($listeners).forEach(key => {
    wrapped[key] = e => {
      e.stopPropagation()
      if (selector && !e.target.matches(selector)) return
      $listeners[key](getData(e.target), e)
    }
  })
  return wrapped
}

export function mergeData (original, data) {
  const merged = Object.assign({}, original)
  if ('class' in data) {
    merged.class = original.class ? [original.class, data.class] : data.class
  }
  if ('attrs' in data) {
    merged.attrs = original.attrs ? Object.assign({}, original.attrs, data.attrs) : data.attrs
  }
  if ('props' in data) {
    merged.props = original.props ? Object.assign({}, original.props, data.props) : data.props
  }
  if ('on' in data) {
    merged.on = original.on ? Object.assign({}, original.on, data.on) : data.on
  }
  return merged
}

export function frameRateLimited (cb, context = null) {
  let ready = true
  function wrapped () {
    if (!ready) return
    ready = false
    window.requestAnimationFrame(() => {
      cb.apply(this, arguments)
      ready = true
    })
  }
  return context ? wrapped.bind(context) : wrapped
}

export function nestedForEach (arr, fn, levels = 1) {
  if (levels > 0) arr.forEach(v => nestedForEach(v, fn, levels - 1))
  else fn(arr)
}

export function findCenter (domainA, domainR) {
  const minA = Math.min(...domainA)
  const maxA = Math.max(...domainA)
  const minR = Math.min(...domainR)
  const maxR = Math.max(...domainR)

  const corners = []
  corners.push([minA, minR], [minA, maxR])
  let a = Math.floor(minA / 90) * 90 + 90
  while (a < maxA && corners.length <= 10) {
    corners.push([a, minR], [a, maxR])
    a += 90
  }
  corners.push([maxA, minR], [maxA, maxR])

  const xyCorners = corners.map(polar2xy)
  const bbox = [
    Math.min(...xyCorners.map(c => c[0])),
    Math.min(...xyCorners.map(c => c[1])),
    Math.max(...xyCorners.map(c => c[0])),
    Math.max(...xyCorners.map(c => c[1]))
  ]

  return [
    -bbox[0] / (bbox[2] - bbox[0]),
    -bbox[1] / (bbox[3] - bbox[1])
  ]
}
