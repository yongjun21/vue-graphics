<template>
  <g class="vg-plot vg-tile-plot">
    <clipPath :id="'clip-path-' + _uid">
      <rect v-bind="clipPathGeom"></rect>
    </clipPath>
    <g :clip-path="`url(#clip-path-${_uid})`">
      <image class="vg-tile" v-for="tile in tiles" :key="tile.key" v-bind="tile.attrs" />
    </g>
  </g>
</template>

<script>
import {bboxFromRange} from '../util'

export default {
  props: {
    xScale: {
      type: Function,
      required: true
    },
    yScale: {
      type: Function,
      required: true
    },
    getTileIndex: {
      type: Function,
      default: defaultGetTileIndex
    },
    getTilePosition: {
      type: Function,
      default: defaultGetTilePosition
    },
    getTileUrl: {
      type: [Function, String],
      required: true
    },
    tileWidth: {
      type: Number,
      default: 256
    }
  },
  computed: {
    getTileUrl_ () {
      const {getTileUrl} = this
      if (typeof getTileUrl === 'function') return getTileUrl
      return (x, y, z) => getTileUrl
        .replace('{x}', x)
        .replace('{y}', y)
        .replace('{z}', z)
    },
    domainBbox () {
      return bboxFromRange(this.xScale.domain(), this.yScale.domain())
    },
    rangeBbox () {
      return bboxFromRange(this.xScale.range(), this.yScale.range())
    },
    zoom () {
      const {getTilePosition, domainBbox, xScale, tileWidth} = this
      const ref = [
        0.5 * domainBbox[0] + 0.5 * domainBbox[2],
        0.5 * domainBbox[1] + 0.5 * domainBbox[3]
      ]
      let x = 0
      let y = 0
      let z = 0
      let [left, top] = getTilePosition(0, 0, 0)
      let [right, bottom] = getTilePosition(1, 1, 0)
      const dx = left > right ? -1 : 1
      const dy = top > bottom ? -1 : 1
      left = xScale(left)
      right = xScale(right)
      while (dx * (right - left) > tileWidth) {
        const mid = getTilePosition(2 * x + 1, 2 * y + 1, z + 1)
        if (dx * (ref[0] - mid[0]) < 0) {
          x = 2 * x
          right = xScale(mid[0])
        } else {
          x = 2 * x + 1
          left = xScale(mid[0])
        }
        if (dy * (ref[1] - mid[1]) < 0) {
          y = 2 * y
        } else {
          y = 2 * y + 1
        }
        z++
      }
      return z
    },
    clipPathGeom () {
      const {rangeBbox} = this
      return {
        x: rangeBbox[0],
        y: rangeBbox[1],
        width: rangeBbox[2] - rangeBbox[0],
        height: rangeBbox[3] - rangeBbox[1]
      }
    },
    tiles () {
      const {getTileIndex, domainBbox, zoom: z} = this
      const {getTilePosition, getTileUrl_, xScale, yScale} = this
      const [xMin, yMin] = getTileIndex(domainBbox[0], domainBbox[3], z)
      const [xMax, yMax] = getTileIndex(domainBbox[2], domainBbox[1], z)
      const tiles = []
      for (let x = xMin; x <= xMax; x++) {
        for (let y = yMin; y <= yMax; y++) {
          const href = getTileUrl_(x, y, z)
          const [x0, y0] = getTilePosition(x, y, z)
          const x1 = getTilePosition(x + 1, y, z)[0]
          const y1 = getTilePosition(x, y + 1, z)[1]
          const left = xScale(x0)
          const right = xScale(x1)
          const top = yScale(y0)
          const bottom = yScale(y1)
          const attrs = {
            href,
            'xlink:href': href,
            x: left - 1,
            y: top - 1,
            width: right - left + 2,
            height: bottom - top + 2,
            preserveAspectRatio: 'none'
          }
          tiles.push({
            key: `${z}/${x}/${y}`,
            attrs
          })
        }
      }
      return tiles
    }
  }
}

export function defaultGetTileIndex (lon, lat, z) {
  let x = toRad(lon)
  let y = Math.asinh(Math.tan(toRad(lat)))

  x = (1 + x / Math.PI) / 2
  y = (1 - y / Math.PI) / 2

  const n = 2 ** z
  x = Math.floor(x * n)
  y = Math.floor(y * n)

  return [x, y]
}

export function defaultGetTilePosition (x, y, z) {
  const n = 2 ** z
  const lon = x / n * 360 - 180
  const lat = toDeg(Math.atan(Math.sinh(Math.PI - y / n * 2 * Math.PI)))
  return [lon, lat]
}

function toRad (deg) {
  return deg / 180 * Math.PI
}

function toDeg (rad) {
  return rad / Math.PI * 180
}
</script>
