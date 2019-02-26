export function UNIQUE_VALUES (values) {
  return [...new Set(values)]
}

export function MIN_MAX (values) {
  if (values.length === 0) return [0, 1]
  return [
    values.reduce((min, v) => v < min ? v : min),
    values.reduce((max, v) => v > max ? v : max)
  ]
}

export function ROUND_MIN_MAX (round) {
  return values => {
    if (values.length === 0) return [0, round]
    return [
      Math.floor(values.reduce((min, v) => v < min ? v : min) / round) * round,
      Math.ceil(values.reduce((max, v) => v > max ? v : max) / round) * round
    ]
  }
}

export function CLAMPED_MIN_MAX (minValue, maxValue = minValue) {
  return values => ([
    values.reduce((min, v) => v < min ? v : min, minValue),
    values.reduce((max, v) => v > max ? v : max, maxValue)
  ])
}

export function CLAMPED_ROUND_MIN_MAX (round, minValue, maxValue = minValue) {
  return values => ([
    Math.floor(values.reduce((min, v) => v < min ? v : min, minValue) / round) * round,
    Math.ceil(values.reduce((max, v) => v > max ? v : max, maxValue) / round) * round
  ])
}
