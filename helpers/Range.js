export function CONTINUOUS (of) {
  return function () {
    return this.domain[of]
  }
}

export function DISCRETE (of) {
  return function () {
    return [0, this.domain[of].length]
  }
}
