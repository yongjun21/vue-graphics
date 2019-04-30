export function MULTIPLES_OF (unit) {
  return scale => {
    const domain = scale.domain()
    const interval = []
    let index = Math.ceil(domain[0] / unit)
    const lastIndex = Math.floor(domain[domain.length - 1] / unit)
    while (index <= lastIndex) interval.push(index++ * unit)
    return interval.map(v => ({label: v, value: scale(v)}))
  }
}

export function TICKS (target = 6) {
  return scale => {
    return scale.ticks(target).map(v => ({label: v, value: scale(v)}))
  }
}

export function MIDDLE () {
  return scale => {
    const offset = scale.bandwidth ? scale.bandwidth() / 2 : 0
    return scale.domain().map(v => ({label: v, value: scale(v) + offset}))
  }
}

export function BETWEEN (includeStart = false, includeEnd = includeStart) {
  return scale => {
    const domain = scale.domain()
    const range = scale.range()
    const interval = []
    if (includeStart) interval.push({label: [null, domain[0]], value: range[0]})
    MIDDLE()(scale).forEach((v, i, arr) => {
      if (i === domain.length - 1) return
      const [t1, t2] = [v, arr[i + 1]]
      interval.push({
        label: [t1.label, t2.label],
        value: 0.5 * t1.value + 0.5 * t2.value
      })
    })
    if (includeEnd) {
      interval.push({
        label: [domain[domain.length - 1], null],
        value: range[range.length - 1]
      })
    }
    return interval
  }
}
