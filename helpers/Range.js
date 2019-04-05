import {polar2xy} from '../util'

export function POLAR (of) {
  return function () {
    const minA = Math.min(...this.domain.a)
    const maxA = Math.max(...this.domain.a)
    const [r1, r2] = this.domain.r

    const corners = []
    corners.push([minA, r1], [minA, r2])
    let a = Math.floor(minA / 90) * 90 + 90
    while (a < maxA && corners.length <= 10) {
      corners.push([a, r1], [a, r2])
      a += 90
    }
    corners.push([maxA, r1], [maxA, r2])

    const xyCorners = corners.map(polar2xy)

    if (of === 'x') {
      return [
        Math.min(...xyCorners.map(c => c[0])),
        Math.max(...xyCorners.map(c => c[0]))
      ]
    }

    if (of === 'y') {
      return [
        Math.min(...xyCorners.map(c => c[1])),
        Math.max(...xyCorners.map(c => c[1]))
      ]
    }
  }
}
