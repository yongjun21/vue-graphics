import TransformHelper from './Transform'
import SplitApplyCombine from './SplitApplyCombine'
import {nestedMap} from '../util'

export function UNIQUE (of) {
  return data => {
    const values = new Set(getValues(data, of))
    return [...values]
  }
}

export function SORTED_UNIQUE (of, by, descending = false) {
  return data => {
    const sorted = [...data]
    if (descending) sorted.sort((a, b) => b[by] - a[by])
    else sorted.sort((a, b) => a[by] - b[by])
    const values = new Set(getValues(sorted, of))
    return [...values]
  }
}

export function MINMAX (of) {
  return data => {
    if (data.length === 0) return [0, 1]
    const values = getValues(data, of)
    return [
      values.reduce((min, v) => v < min ? v : min),
      values.reduce((max, v) => v > max ? v : max)
    ]
  }
}

export function ROUNDED_MINMAX (of, round) {
  return data => {
    if (data.length === 0) return [0, round]
    const values = getValues(data, of)
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
    const values = getValues(data, of)
    return [
      values.reduce((min, v) => v < min ? v : min, minValue),
      values.reduce((max, v) => v > max ? v : max, maxValue)
    ]
  }
}

export function STACKED_MINMAX (of, by) {
  return data => {
    const values = SplitApplyCombine(data)
      .split(by)
      .apply((members, group) => {
        group.min = members.reduce((sum, d) => sum + Math.min(0, d[of]), 0)
        group.max = members.reduce((sum, d) => sum + Math.max(0, d[of]), 0)
      })
      .combine()
    return [
      values.reduce((min, d) => d.min < min ? d.min : min, 0),
      values.reduce((max, d) => d.max > max ? d.max : max, 0)
    ]
  }
}

export function CLAMPED_ROUNDED_MINMAX (of, round, minValue, maxValue = minValue) {
  return data => {
    const values = getValues(data, of)
    const clampedMin = values.reduce((min, v) => v < min ? v : min, minValue)
    const clampedMax = values.reduce((max, v) => v > max ? v : max, maxValue)
    return [
      Math.floor(clampedMin / round) * round,
      Math.ceil(clampedMax / round) * round
    ]
  }
}

export function STACKED_ROUNDED_MINMAX (of, by, round) {
  return data => {
    const values = SplitApplyCombine(data)
      .split(by)
      .apply((members, group) => {
        group.max = members.reduce((sum, d) => sum + Math.min(0, d[of]), 0)
        group.min = members.reduce((sum, d) => sum + Math.max(0, d[of]), 0)
      })
      .combine()
    const stackedMin = values.reduce((min, d) => d.min < min ? d.min : min, 0)
    const stackedMax = values.reduce((max, d) => d.max > max ? d.max : max, 0)
    return [
      Math.floor(stackedMin / round) * round,
      Math.ceil(stackedMax / round) * round
    ]
  }
}

export function BBOX (axis, bearing = 0) {
  if (axis === 'x') axis = 0
  if (axis === 'y') axis = 1
  const nestedLevels = {
    Point: 0,
    LineString: 1,
    Polygon: 2,
    MultiPoint: 1,
    MultiLineString: 2,
    MultiPolygon: 3
  }
  const rotate = new TransformHelper().rotate(bearing).apply
  return features => {
    let min = Infinity
    let max = -Infinity
    features.forEach(f => {
      nestedMap(f.geometry.coordinates, pt => {
        const value = rotate(pt)[axis]
        if (value < min) min = value
        if (value > max) max = value
      }, nestedLevels[f.geometry.type])
    })
    return [min, max]
  }
}

function getValues (data, of) {
  if (!Array.isArray(of)) return data.map(d => d[of])
  return of.reduce((arr, key) => arr.concat(data.map(d => d[key])), [])
}
