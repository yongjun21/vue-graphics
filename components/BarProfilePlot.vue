<template>
  <g class="vg-plot vg-bar-profile-plot">
    <path v-for="{label, value, yMinus, yPlus} in grouped" :key="label"
      class="vg-area"
      :class="classed && classed(label)"
      v-bind="getGeom(value, yMinus, yPlus)">
    </path>
  </g>
</template>

<script>
import line from 'd3-shape/src/line'

export default {
  name: 'BarProfilePlot',
  inheritAttrs: false,
  props: {
    dataView: {
      type: Array,
      required: true
    },
    xScale: {
      type: Function,
      default: v => v
    },
    yScale: {
      type: Function,
      default: v => v
    },
    fillMode: {
      validator: prop => ['forwards', 'backwards', 'both', 'none'].includes(prop),
      default: 'both'
    },
    partition: null,
    classed: Function
  },
  computed: {
    grouped () {
      const {dataView, xScale, fillMode, hasGeom} = this
      const xDomain = xScale.domain()

      const ungrouped = []
      xDomain.forEach((x, i) => {
        const d = dataView.find(d => d.x === x)
        if (d && hasGeom(d)) {
          ungrouped.push({
            label: d.g,
            value: [d],
            start: i,
            end: i + 1
          })
        }
      })
      if (ungrouped.length === 0) return []

      const grouped = []
      let curr = ungrouped.shift()
      grouped.push(curr)
      while (ungrouped.length > 0) {
        const next = ungrouped.shift()
        if (curr.label === next.label && curr.end === next.start) {
          curr.value = curr.value.concat(next.value)
          curr.end = next.end
        } else {
          curr = next
          grouped.push(curr)
        }
      }

      if (fillMode === 'forwards' || fillMode === 'both') {
        grouped.forEach((curr, i) => {
          const next = (i < grouped.length - 1) ? grouped[i + 1] : {start: xDomain.length}
          for (let k = curr.end; k < next.start; k++) {
            curr.value.push({x: xDomain[k], y: 0})
            curr.end++
          }
        })
      }
      if (fillMode === 'backwards' || fillMode === 'both') {
        grouped.forEach((curr, i) => {
          const prev = i > 0 ? grouped[i - 1] : {end: 0}
          for (let k = curr.start - 1; k >= prev.end; k--) {
            curr.value.unshift({x: xDomain[k], y: 0})
            curr.start--
          }
        })
      }

      if (this.partition != null) {
        grouped.forEach(curr => {
          curr.yMinus = 0
          curr.yPlus = 0
        })
      } else {
        grouped.forEach((curr, i) => {
          const prev = grouped[i - 1]
          const next = grouped[i + 1]
          curr.yMinus = (!prev || curr.start > prev.end) ? 0 : prev.value[prev.value.length - 1].y
          curr.yPlus = (!next || curr.end < next.start) ? 0 : next.value[0].y
        })
      }

      return grouped
    }
  },
  methods: {
    getGeom (data, yMinus, yPlus) {
      const {xScale, yScale} = this
      const xRange = xScale.range()
      const reverse = xRange[0] > xRange[xRange.length - 1]
      const step = xScale.step()
      const cp = []
      if (yMinus < data[0].y) {
        cp.push([
          xScale(data[0].x),
          yScale(yMinus)
        ])
      }
      data.forEach(d => {
        const x = xScale(d.x)
        const y = yScale(d.y)
        if (reverse) {
          cp.push([x + step, y])
          cp.push([x, y])
        } else {
          cp.push([x, y])
          cp.push([x + step, y])
        }
        yMinus = d.y
      })
      if (yPlus < yMinus) {
        cp.push([
          cp[cp.length - 1][0],
          yScale(yPlus)
        ])
      }
      return {d: line()(simplify(cp, true))}
    },
    hasGeom (d) {
      return this.yScale(d.y) != null
    }
  }
}

function simplify (input, direction = false) {
  const deltas = []
  input.forEach(([x, y], i) => {
    if (i === 0) return
    deltas.push([
      x - input[i - 1][0],
      y - input[i - 1][1]
    ])
  })
  const output = []
  output.push(input[0])
  let delta = deltas.shift()
  while (deltas.length > 0) {
    const next = deltas.shift()
    if (sameSlope(delta, next, direction)) {
      delta[0] += next[0]
      delta[1] += next[1]
    } else {
      const last = output.pop()
      output.push(last, [
        last[0] + delta[0],
        last[1] + delta[1]
      ])
      delta = next
    }
  }
  const last = output.pop()
  output.push(last, [
    last[0] + delta[0],
    last[1] + delta[1]
  ])
  return output
}

function sameSlope (a, b, direction = false) {
  if (a[0] === 0 || b[0] === 0) return a[0] === 0 && b[0] === 0
  return a[1] / a[0] === b[1] / b[0] && (!direction || a[0] * b[0] > 0)
}
</script>
