// for testing
export function createSVGElement (tag) {
  return document.createElementNS('http://www.w3.org/2000/svg', tag)
}

export function mapRadialToCartesian (a, radius, center) {
  center = center || [0, 0]
  return [
    Math.round(Math.cos(a) * radius + center[0]),
    Math.round(Math.sin(a) * radius + center[1])
  ]
}

export function mergeClass () {
  const merged = {}
  for (let i = 0; i < arguments.length; i++) {
    const arg = arguments[i]
    if (Array.isArray(arg)) {
      arg.forEach(v => {
        Object.assign(merged, mergeClass(v))
      })
    } else if (typeof arg === 'object') {
      Object.assign(merged, arg)
    } else if (typeof arg === 'string') {
      arg.split(' ').forEach(s => {
        if (s.length > 0) merged[s] = true
      })
    }
  }
  return merged
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

export function frameRateLimited (cb) {
  let ready = true
  return function () {
    if (!ready) return
    ready = false
    window.requestAnimationFrame(() => {
      cb.call(this)
      ready = true
    })
  }
}

export function orientateText (anchor, offset, rotate) {
  offset = offset || [0, 0]

  function getOffsetAngle (offset) {
    if (offset[0] === 0 && offset[1] === 0) return null
    return Math.atan2(offset[1], offset[0]) * 180 / Math.PI - 90
  }

  const attrs = {
    'dy': ['topleft', 'top', 'topright'].indexOf(anchor) > -1 ? '0.7em'
        : ['bottomleft', 'bottom', 'bottomright'].indexOf(anchor) > -1 ? '0'
        : '0.35em',
    'text-anchor': ['topleft', 'left', 'bottomleft'].indexOf(anchor) > -1 ? 'start'
                 : ['topright', 'right', 'bottomright'].indexOf(anchor) > -1 ? 'end'
                 : 'middle'
  }

  const anchorAngles = {
    'top': 0,
    'topright': 0,
    'right': -90,
    'bottomright': -180,
    'bottom': -180,
    'bottomleft': -180,
    'left': -270,
    'topleft': 0
  }
  const offsetAngle = getOffsetAngle(offset)

  const transformations = []
  if (offsetAngle != null) {
    transformations.push(`translate(${offset[0]} ${offset[1]})`)
  }
  if (rotate != null) {
    let deg = rotate
    if (anchor in anchorAngles && offsetAngle != null) {
      deg += anchorAngles[anchor] + offsetAngle
    }
    transformations.push(`rotate(${deg})`)
  }
  if (transformations.length > 0) {
    attrs.transform = transformations.join(' ')
  }

  return attrs
}
