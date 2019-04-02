export default class TransformHelper {
  constructor (origin = [0, 0]) {
    this.origin = origin
    this.params = {
      a: 1,
      b: 0,
      c: 0,
      d: 1,
      e: 0,
      f: 0
    }
    this.apply = this.apply.bind(this)
    this.unapply = this.unapply.bind(this)
  }

  setOrigin (origin) {
    if (!origin) return this
    this.origin = origin
    return this
  }

  applyOrigin (fn, x0, y0) {
    if (x0 == null) x0 = this.origin[0]
    if (y0 == null) y0 = this.origin[1]
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

  scale (sx, sy, origin = []) {
    if (sx == null) return this
    if (sy == null) sy = sx
    else if (typeof sy !== 'number') {
      origin = sy
      sy = sx
    }
    this.scaleX(sx, origin[0])
    this.scaleY(sy, origin[1])
    return this
  }

  scaleX (sx, x0) {
    if (sx == null) return this
    return this.applyOrigin(function () {
      this.params.a *= sx
      this.params.c *= sx
      this.params.e *= sx
    }, x0, null)
  }

  scaleY (sy, y0) {
    if (sy == null) return this
    return this.applyOrigin(function () {
      this.params.b *= sy
      this.params.d *= sy
      this.params.f *= sy
    }, null, y0)
  }

  flipX (x0) {
    return this.scaleX(-1, x0)
  }

  flipY (y0) {
    return this.scaleY(-1, y0)
  }

  rotate180 (origin = []) {
    this.flipX(origin[0])
    this.flipY(origin[1])
    return this
  }

  rotateRight (origin = []) {
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

  rotateLeft (origin = []) {
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

  invert (origin = []) {
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

  rotate (A, origin = []) {
    if (A == null) return this
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
    }, origin[0], origin[1])
  }

  skewX (A, x0) {
    if (A == null) return this
    const tanA = Math.tan(A * Math.PI / 180)
    return this.applyOrigin(function () {
      const {a, b, c, d, e, f} = this.params
      this.params.a = a + tanA * b
      this.params.c = c + tanA * d
      this.params.e = e + tanA * f
    }, x0, null)
  }

  skewY (A, y0) {
    if (A == null) return this
    const tanA = Math.tan(A * Math.PI / 180)
    return this.applyOrigin(function () {
      const {a, b, c, d, e, f} = this.params
      this.params.b = tanA * a + b
      this.params.d = tanA * c + d
      this.params.f = tanA * e + f
    }, null, y0)
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
    const t = new TransformHelper(this.origin)
    Object.assign(t.params, this.params)
    return t
  }

  inverse () {
    const t = new TransformHelper(this.origin)
    t.params = this.complement
    return t
  }

  chain (transform) {
    const t = this.clone()
    const {a, b, c, d, e, f} = transform.params
    return t.matrix(a, b, c, d, e, f)
  }

  decompose () {
    const {a, b, c, d, e, f} = this.params
    const decomposed = [new TransformHelper(), new TransformHelper()]
    Object.assign(decomposed[0].params, {a, b, c, d})
    Object.assign(decomposed[1].params, {e, f})
    return decomposed
  }

  textCorrection (origin = [0, 0]) {
    return new TransformHelper()
      .translate(-origin[0], -origin[1])
      .chain(this.inverse().decompose()[0])
      .translate(origin[0], origin[1])
  }

  get complement () {
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
    const {a, b, c, d, e, f} = this.complement
    return [
      a * x + c * y + e,
      b * x + d * y + f
    ]
  }

  toString (dp = 5) {
    const {a, b, c, d, e, f} = this.params
    return `matrix(${[a, b, c, d, e, f].map(round(5)).join(' ')})`
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
