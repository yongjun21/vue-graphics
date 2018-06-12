let $path

export function getPathLength (d) {
  $path = $path || document.createElementNS('http://www.w3.org/2000/svg', 'path')
  $path.setAttribute('d', d)
  return Math.ceil($path.getTotalLength())
}

export function mapRadialToCartesian (a, radius, center) {
  center = center || [0, 0]
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

  const anchors = ['top', 'topright', 'right', 'bottomright', 'bottom', 'bottomleft', 'left', 'topleft']
  const offsetAngle = getOffsetAngle(offset)

  const transformations = []
  if (offsetAngle != null) {
    transformations.push(`translate(${offset[0]} ${offset[1]})`)
  }
  if (rotate != null) {
    let deg = rotate
    if (anchors.indexOf(anchor) > -1 && offsetAngle != null) {
      deg += anchors.indexOf(anchor) * -45 + offsetAngle
    }
    transformations.push(`rotate(${deg})`)
  }
  if (transformations.length > 0) {
    attrs.transform = transformations.join(' ')
  }

  return attrs
}
