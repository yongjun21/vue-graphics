export function UNIQUE (of) {
  return data => {
    const values = new Set(data.map(d => d[of]))
    return [...values]
  }
}

export function SORTED_UNIQUE (of, by, descending = false) {
  return data => {
    const sorted = [...data]
    if (descending) sorted.sort((a, b) => b[by] - a[by])
    else sorted.sort((a, b) => a[by] - b[by])
    const values = new Set(sorted.map(d => d[of]))
    return [...values]
  }
}

export function MINMAX (of) {
  return data => {
    if (data.length === 0) return [0, 1]
    const values = data.map(d => d[of])
    return [
      values.reduce((min, v) => v < min ? v : min),
      values.reduce((max, v) => v > max ? v : max)
    ]
  }
}

export function ROUNDED_MINMAX (of, round) {
  return data => {
    if (data.length === 0) return [0, round]
    const values = data.map(d => d[of])
    const min = values.reduce((min, v) => v < min ? v : min)
    const max = values.reduce((max, v) => v > max ? v : max)
    return [
      Math.floor(min / round) * round,
      Math.ceil(max / round) * round
    ]
  }
}

export function CLAMPED_MINMAX (of, minValue, maxValue = minValue) {
  return data => {
    const values = data.map(d => d[of])
    return [
      values.reduce((min, v) => v < min ? v : min, minValue),
      values.reduce((max, v) => v > max ? v : max, maxValue)
    ]
  }
}

export function CLAMPED_ROUNDED_MINMAX (of, round, minValue, maxValue = minValue) {
  return data => {
    const values = data.map(d => d[of])
    const clampedMin = values.reduce((min, v) => v < min ? v : min, minValue)
    const clampedMax = values.reduce((max, v) => v > max ? v : max, maxValue)
    return [
      Math.floor(clampedMin / round) * round,
      Math.ceil(clampedMax / round) * round
    ]
  }
}
