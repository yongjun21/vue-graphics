import {scaleBand, scaleLinear} from 'd3-scale'
import {stack} from 'd3-shape'

import Bar from '../elements/Bar'
import LinearAxis from './LinearAxis'
import boxLayout from '../mixins/boxLayout'

import {mergeClass} from '../util'

export default {
  name: 'StackedBarChart',
  extends: boxLayout,
  props: ['data', 'domain', 'range', 'horizontal', 'paddingInner', 'paddingOuter', 'xLabel', 'yLabel'],
  computed: {
    xScale () {
      const scale = scaleBand()
      scale.domain(this.data.map((d, i) => i))
      scale.rangeRound(this.horizontal == null ? this.xRange : this.yRange)
      scale.paddingInner(this.paddingInner || 0)
      scale.paddingOuter(this.paddingOuter || 0)
      return scale
    },
    yScale () {
      const scale = scaleLinear()
      scale.domain(this.range)
      scale.rangeRound(this.horizontal == null ? this.yRange : this.xRange)
      return scale
    },
    xMax () {
      const range = this.xScale.range()
      return Math.round(range[range.length - 1])
    },
    yMax () {
      const range = this.yScale.range()
      return Math.round(range[range.length - 1])
    },
    stackedData () {
      const keys = this.domain.map(d => typeof d === 'object' ? d.value : d)
      return stack().keys(keys)(this.data)
    },
    bars () {
      if (this.width == null || this.height == null) return []

      const {xScale, yScale, horizontal, domain, data} = this
      const yMax = yScale.range()[1]

      const collection = []

      this.stackedData.forEach((row, j) => {
        row.forEach(([v1, v2], i) => {
          const y1 = yScale(v1)
          const y2 = yScale(v2)
          const attrs = horizontal ? {
            width: xScale.bandwidth(),
            height: y2 - y1,
            x: xScale(i),
            y: yMax - y2
          } : {
            width: y2 - y1,
            height: xScale.bandwidth(),
            x: y1,
            y: xScale(i)
          }
          const xLabel = data[i].label || i
          const yLabel = (typeof domain[j] === 'object' && domain[j].label) || j
          attrs['data-x-label'] = xLabel
          attrs['data-y-label'] = yLabel
          collection.push({
            key: xLabel + '__' + yLabel,
            attrs,
            class: mergeClass(data[i].class, typeof domain[j] === 'object' && domain[j].class)
          })
        })
      })

      return collection
    }
  },
  components: {
    'bar-element': Bar
  },
  render (h) {
    let $horizontalAxis, $verticalAxis
    if (this.width != null && this.height != null) {
      if (this.horizontal == null) {
        $horizontalAxis = h(LinearAxis, {
          class: 'axis',
          props: {
            horizontal: true,
            offset: this.y + this.height,
            scale: this.xScale,
            domain: this.xScale.domain(),
            extrapolate: true,
            label: this.xLabel
          },
          scopedSlots: {
            tickLabel: data => h('text', data, this.data[data.key].label || data.key)
          }
        })
        $verticalAxis = h(LinearAxis, {
          class: 'axis',
          props: {
            offset: this.x,
            scale: this.yScale,
            domain: this.yScale.ticks(),
            extrapolate: true,
            label: this.yLabel
          }
        })
      } else {
        $horizontalAxis = h(LinearAxis, {
          class: 'axis',
          props: {
            horizontal: true,
            offset: this.y + this.height,
            scale: this.yScale,
            domain: this.yScale.ticks(),
            extrapolate: true,
            label: this.xLabel
          }
        })
        $verticalAxis = h(LinearAxis, {
          class: 'axis',
          props: {
            offset: this.x,
            scale: this.xScale,
            domain: this.xScale.domain(),
            extrapolate: true,
            label: this.yLabel
          },
          scopedSlots: {
            tickLabel: data => {
              return h('text', data, this.data[data.key].label || data.key)
            }
          }
        })
      }
    }

    return h('svg', [
      h('g', this.bars.map(bar => h('bar-element', bar))),
      $horizontalAxis,
      $verticalAxis
    ])
  }
}
