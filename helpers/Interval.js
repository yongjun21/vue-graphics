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

export function DIVIDER () {
  return scale => {
    const domain = scale.domain()
    const range = scale.range()
    const step = scale.step()
    return domain.map((v, i) => {
      const label = i === 0 ? [null, v] : [domain[i - 1], v]
      const value = range[0] + i * step
      return {label, value}
    }).concat({label: [domain[domain.length - 1], null], value: range[range.length - 1]})
  }
}
