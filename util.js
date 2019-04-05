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
      cb.call(this)
      ready = true
    })
  }
  return context ? wrapped.bind(context) : wrapped
}
