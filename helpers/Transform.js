const IDENTITY = {
  a: 1,
  b: 0,
  c: 0,
  d: 1,
  e: 0,
  f: 0
}

const epsilon = 0.00001

export default class TransformHelper {
  constructor () {
    this.params = Object.assign({}, IDENTITY)
    this.apply = this.apply.bind(this)
    this.unapply = this.unapply.bind(this)
  }

  applyOrigin (fn, x0, y0) {
    this.params.e -= x0
    this.params.f -= y0
    fn.call(this)
    this.params.e += x0
    this.params.f += y0
    return this
  }

  translate (dx = 0, dy = 0) {
    this.params.e += dx
    this.params.f += dy
    return this
  }

  translateX (dx = 0) {
    this.params.e += dx
    return this
  }

  translateY (dy = 0) {
    this.params.f += dy
    return this
  }

  scale (sx, sy = [0, 0], origin = [0, 0]) {
    if (sx == null) return this
    if (typeof sy !== 'number') {
      [sy, origin] = [sx, sy]
    }
    this.scaleX(sx, origin[0])
    this.scaleY(sy, origin[1])
    return this
  }

  scaleX (sx, x0 = 0) {
    if (sx == null) return this
    return this.applyOrigin(function () {
      this.params.a *= sx
      this.params.c *= sx
      this.params.e *= sx
    }, x0, 0)
  }

  scaleY (sy, y0 = 0) {
    if (sy == null) return this
    return this.applyOrigin(function () {
      this.params.b *= sy
      this.params.d *= sy
      this.params.f *= sy
    }, 0, y0)
  }

  flipX (x0 = 0) {
    return this.scaleX(-1, x0)
  }

  flipY (y0 = 0) {
    return this.scaleY(-1, y0)
  }

  rotate180 (origin = [0, 0]) {
    this.flipX(origin[0])
    this.flipY(origin[1])
    return this
  }

  rotateRight (origin = [0, 0]) {
    return this.applyOrigin(function () {
      const {a, b, c, d, e, f} = this.params
      this.params.a = -b
      this.params.b = a
      this.params.c = -d
      this.params.d = c
      this.params.e = -f
      this.params.f = e
    }, origin[0], origin[1])
  }

  rotateLeft (origin = [0, 0]) {
    return this.applyOrigin(function () {
      const {a, b, c, d, e, f} = this.params
      this.params.a = b
      this.params.b = -a
      this.params.c = d
      this.params.d = -c
      this.params.e = f
      this.params.f = -e
    }, origin[0], origin[1])
  }

  invert (origin = [0, 0]) {
    return this.applyOrigin(function () {
      const {a, b, c, d, e, f} = this.params
      this.params.a = b
      this.params.b = a
      this.params.c = d
      this.params.d = c
      this.params.e = f
      this.params.f = e
    }, origin[0], origin[1])
  }

  rotate (A, x0 = 0, y0 = 0) {
    if (!A) return this
    if (Array.isArray(x0)) {
      [x0, y0] = x0 // allows origin to be passed in in the form of an array
    }
    const rad = A * Math.PI / 180
    const sinA = Math.sin(rad)
    const cosA = Math.cos(rad)
    return this.applyOrigin(function () {
      const {a, b, c, d, e, f} = this.params
      this.params.a = cosA * a - sinA * b
      this.params.b = sinA * a + cosA * b
      this.params.c = cosA * c - sinA * d
      this.params.d = sinA * c + cosA * d
      this.params.e = cosA * e - sinA * f
      this.params.f = sinA * e + cosA * f
    }, x0, y0)
  }

  skewX (A, x0 = 0) {
    if (!A) return this
    const tanA = Math.tan(A * Math.PI / 180)
    return this.applyOrigin(function () {
      const {a, b, c, d, e, f} = this.params
      this.params.a = a + tanA * b
      this.params.c = c + tanA * d
      this.params.e = e + tanA * f
    }, x0, 0)
  }

  skewY (A, y0 = 0) {
    if (!A) return this
    const tanA = Math.tan(A * Math.PI / 180)
    return this.applyOrigin(function () {
      const {a, b, c, d, e, f} = this.params
      this.params.b = tanA * a + b
      this.params.d = tanA * c + d
      this.params.f = tanA * e + f
    }, 0, y0)
  }

  matrix (A, B, C, D, E, F) {
    const {a, b, c, d, e, f} = this.params
    this.params.a = A * a + C * b
    this.params.b = B * a + D * b
    this.params.c = A * c + C * d
    this.params.d = B * c + D * d
    this.params.e = A * e + C * f + E
    this.params.f = B * e + D * f + F
    return this
  }

  clone () {
    const t = new TransformHelper()
    Object.assign(t.params, this.params)
    return t
  }

  inverse () {
    const t = new TransformHelper()
    Object.assign(t.params, this.inverseParams)
    return t
  }

  chain (transform) {
    const t = this.clone()
    const {a, b, c, d, e, f} = transform.params
    return t.matrix(a, b, c, d, e, f)
  }

  textCorrection (origin = [0, 0]) {
    const {a, b, c, d} = this.inverseParams
    return new TransformHelper()
      .translate(-origin[0], -origin[1])
      .matrix(a, b, c, d, 0, 0)
      .translate(origin[0], origin[1])
  }

  decompose () {
    const {a, b, c, d, e: translateX, f: translateY} = this.params
    let scaleX, scaleY, skewX, rotate
    if (a === 0 && b === 0 && c === 0 && d === 0) {
      scaleX = scaleY = skewX = rotate = 0
    } else if (c === 0 && d === 0) {
      rotate = Math.atan2(b, a) * 180 / Math.PI
      scaleX = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))
      scaleY = skewX = 0
    } else if (a === 0 && b === 0) {
      rotate = -Math.atan2(c, d) * 180 / Math.PI
      scaleY = Math.sqrt(Math.pow(c, 2) + Math.pow(d, 2))
      scaleX = skewX = 0
    } else {
      const det = a * d - b * c
      scaleX = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))
      rotate = Math.atan2(b, a) * 180 / Math.PI
      if (a < 0 && det < 0) {
        scaleX = -scaleX
        rotate = rotate >= 0 ? rotate - 180 : rotate + 180
      }
      scaleY = det / scaleX
      skewX = Math.atan2(a * c + b * d, det) * 180 / Math.PI
    }
    if (rotate < -180 + epsilon) rotate = -rotate
    return {scaleX, scaleY, skewX, rotate, translateX, translateY, toString: decomposedToString}
  }

  static recompose (decomposed) {
    const {scaleX, scaleY, skewX, rotate, translateX, translateY} = decomposed
    return new TransformHelper()
      .scale(scaleX, scaleY)
      .skewX(skewX)
      .rotate(rotate)
      .translate(translateX, translateY)
  }

  static solve (from, to) {
    return from.inverse().chain(to)
  }

  static parse (str) {
    const parsed = new TransformHelper()
    if (!str) return parsed
    const transformations = []
    const pattern = /(translate|scale|rotate|skewX|skewY|matrix)\(([\s\S]+?)\)/g
    let match
    while ((match = pattern.exec(str)) != null) {
      transformations.push({
        type: match[1],
        params: match[2].split(/[\s,]+/).map(Number)
      })
    }
    transformations.reverse().forEach(f => {
      parsed[f.type].apply(parsed, f.params)
    })
    return parsed
  }

  get inverseParams () {
    const {a, b, c, d, e, f} = this.params
    const disc = a * d - b * c
    return {
      a: d / disc,
      b: -b / disc,
      c: -c / disc,
      d: a / disc,
      e: (c * f - d * e) / disc,
      f: (b * e - a * f) / disc
    }
  }

  apply ([x, y]) {
    const {a, b, c, d, e, f} = this.params
    return [
      a * x + c * y + e,
      b * x + d * y + f
    ]
  }

  unapply ([x, y]) {
    const {a, b, c, d, e, f} = this.inverseParams
    return [
      a * x + c * y + e,
      b * x + d * y + f
    ]
  }

  isIdentity () {
    const params = this.params
    return Object.keys(params).every(key => approach(params[key] - IDENTITY[key]))
  }

  isCloneOf (t) {
    const params = this.params
    return Object.keys(params).every(key => params[key] === t.params[key])
  }

  isInverseOf (t) {
    const params = this.inverseParams
    return Object.keys(params).every(key => params[key] === t.params[key])
  }

  toString (dp = -Math.log10(epsilon)) {
    const {a, b, c, d, e, f} = this.params
    return `matrix(${[a, b, c, d, e, f].map(round(dp)).join(' ')})`
  }
}

export function interpolateTransform (from, to) {
  from = from instanceof TransformHelper ? from : TransformHelper.parse(from)
  to = to instanceof TransformHelper ? to : TransformHelper.parse(to)
  const fromParams = Object.assign(from.params)
  const toParams = Object.assign(to.params)
  return t => {
    const interpolated = new TransformHelper()
    Object.keys(toParams).forEach(key => {
      interpolated.params[key] = (1 - t) * fromParams[key] + t * toParams[key]
    })
    return interpolated
  }
}

export function interpolateTransform2 (from, to) {
  from = from instanceof TransformHelper ? from : TransformHelper.parse(from)
  to = to instanceof TransformHelper ? to : TransformHelper.parse(to)
  const {e, f} = from.params
  from = from.clone().translate(-e, -f)
  to = to.clone().translate(-e, -f)
  const fromParams = {
    scaleX: 1,
    scaleY: 1,
    skewX: 0,
    rotate: 0,
    translateX: 0,
    translateY: 0
  }
  const toParams = TransformHelper.solve(from, to).decompose()
  return t => {
    const interpolatedParams = {}
    Object.keys(toParams).forEach(key => {
      interpolatedParams[key] = (1 - t) * fromParams[key] + t * toParams[key]
    })
    return from.chain(TransformHelper.recompose(interpolatedParams)).translate(e, f)
  }
}

function round (dp) {
  if (dp === 0) return v => v.toFixed(0)
  return v => {
    let n = 0
    let rounded = v.toFixed(dp).split('')
    while (rounded[rounded.length - 1] === '0' && n++ < dp) {
      rounded.pop()
    }
    if (n === dp) rounded.pop()
    return rounded.join('')
  }
}

function decomposedToString () {
  const {scaleX, scaleY, skewX, rotate, translateX, translateY} = this
  const transformations = []
  if (!approach(translateX, 0) || !approach(translateY, 0)) {
    transformations.push(`translate(${translateX} ${translateY})`)
  }
  if (!approach(rotate, 0)) {
    transformations.push(`rotate${rotate}`)
  }
  if (!approach(skewX, 0)) {
    transformations.push(`skewX(${skewX})`)
  }
  if (!approach(scaleX, 1) || !approach(scaleY, 1)) {
    transformations.push(`scale(${scaleX} ${scaleY})`)
  }
  return transformations.join(' ')
}

function approach (a, b, e = epsilon) {
  return Math.abs(a - b) < e
}
