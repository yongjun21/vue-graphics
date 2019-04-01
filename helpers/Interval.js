export function FIXED_SPACING (of, space) {
  return function () {
    const domain = this.domain[of]
    const interval = []
    let index = Math.ceil(domain[0] / space)
    const lastIndex = Math.floor(domain[1] / space)
    while (index <= lastIndex) interval.push(index++ * space)
    return interval
  }
}

export function NICE (of, target = 4) {
  return function () {
    const domain = this.domain[of]
    const order = Math.log10((domain[1] - domain[0]) / (target - 1))
    const space = Math.pow(10, Math.floor(order))
    return [
      FIXED_SPACING(of, space * 5).call(this),
      FIXED_SPACING(of, space).call(this)
    ].find(interval => interval.length >= target)
  }
}

export function MIDDLE (of) {
  return function () {
    const domain = this.domain[of]
    return domain.map((v, i) => ({label: v, value: i + 0.5}))
  }
}

export function DIVIDER (of) {
  return function () {
    const domain = this.domain[of]
    return domain.map((v, i) => i).concat(domain.length)
  }
}
