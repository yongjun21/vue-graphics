const IDENTITY = {
  a: 1,
  b: 0,
  c: 0,
  d: 1,
  e: 0,
  f: 0
}

export default class TransformHelper {
  constructor (transform) {
    this.params = Object.assign({}, IDENTITY)
    this.apply = this.apply.bind(this)
    this.unapply = this.unapply.bind(this)
    if (typeof transform === 'string') this.parse(transform)
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
    if (A == null) return this
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
    if (A == null) return this
    const tanA = Math.tan(A * Math.PI / 180)
    return this.applyOrigin(function () {
      const {a, b, c, d, e, f} = this.params
      this.params.a = a + tanA * b
      this.params.c = c + tanA * d
      this.params.e = e + tanA * f
    }, x0, 0)
  }

  skewY (A, y0 = 0) {
    if (A == null) return this
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

  parse (str) {
    if (!str) return this
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
      this[f.type].apply(this, f.params)
    })
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

  decompose () {
    const {a, b, c, d, e, f} = this.params
    const scaleX = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))
    const skewX = (a * c + b * d) / scaleX
    const scaleY = (a * d - b * c) / scaleX
    const rotate = Math.atan2(b, a) * 180 / Math.PI

    return {
      scaleX,
      skewX,
      scaleY,
      rotate,
      translateX: e,
      translateY: f
    }
  }

  static recompose (decomposed) {
    const {scaleX, skewX, scaleY, rotate, translateX, translateY} = decomposed
    return new TransformHelper()
      .matrix(scaleX, 0, skewX, scaleY, 0, 0)
      .rotate(rotate)
      .translate(translateX, translateY)
  }

  textCorrection (origin = [0, 0]) {
    const {a, b, c, d} = this.inverseParams
    return new TransformHelper()
      .translate(-origin[0], -origin[1])
      .matrix(a, b, c, d, 0, 0)
      .translate(origin[0], origin[1])
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
    return Object.keys(params).every(key => params[key] === IDENTITY[key])
  }

  isCloneOf (t) {
    const params = this.params
    return Object.keys(params).every(key => params[key] === t.params[key])
  }

  isInverseOf (t) {
    const params = this.inverseParams
    return Object.keys(params).every(key => params[key] === t.params[key])
  }

  toString (dp = 5) {
    const {a, b, c, d, e, f} = this.params
    return `matrix(${[a, b, c, d, e, f].map(round(5)).join(' ')})`
  }
}

export function interpolateTransform (from, to) {
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
  const fromDecomposed = from.decompose()
  const toDecomposed = to.Decompose()
  if (toDecomposed.rotate - fromDecomposed.rotate > 180) fromDecomposed.rotate += 360
  else if (toDecomposed.rotate - fromDecomposed.rotate < -180) fromDecomposed.rotate -= 360
  return t => {
    const interpolatedDecomposed = {}
    Object.keys(toDecomposed).forEach(key => {
      interpolatedDecomposed[key] = (1 - t) * fromDecomposed[key] + t * toDecomposed[key]
    })
    return TransformHelper.recompose(interpolatedDecomposed)
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
