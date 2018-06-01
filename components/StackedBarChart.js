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
      const domain = this.data.map((d, i) => i)
      const range = this.horizontal == null ? this.xRange : this.yRange
      if (!range) return

      const scale = scaleBand()
      scale.domain(domain)
      scale.rangeRound(range)
      scale.paddingInner(this.paddingInner || 0)
      scale.paddingOuter(this.paddingOuter || 0)
      return scale
    },
    yScale () {
      let domain = this.range
      if (!domain) {
        let min = 0
        let max = 0
        this.stackedData.forEach(row => {
          row.forEach(d => {
            if (d[0] < min) min = d[0]
            if (d[1] > max) max = d[1]
          })
        })
        domain = [min, max]
      }
      const range = this.horizontal == null ? this.yRange : this.xRange
      if (!range) return

      const scale = scaleLinear()
      scale.domain(domain).nice()
      scale.rangeRound(range)
      return scale
    },
    domain_ () {
      return this.domain.map((d, i) => typeof d === 'object' ? d : {value: d})
    },
    stackedData () {
      const keys = this.domain_.map(d => d.value)
      return stack().keys(keys)(this.data)
    },
    bars () {
      if (this.width == null || this.height == null) return []

      const {xScale, yScale, horizontal, domain_, data} = this
      const yMax = yScale.range()[1]

      const collection = []

      this.stackedData.forEach((row, j) => {
        row.forEach(([v1, v2], i) => {
          const y1 = yScale(v1)
          const y2 = yScale(v2)
          const attrs = horizontal == null ? {
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
          const label = data[i].label || i
          const group = domain_[j].label || domain_[j].value
          attrs['data-label'] = label
          attrs['data-group'] = group
          collection.push({
            key: label + '__' + group,
            attrs,
            class: mergeClass(data[i].class, domain_[j].class),
            style: mergeClass(data[i].style, domain_[j].style)
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

    const $slots = this.$scopedSlots.default && this.$scopedSlots.default(this)

    return h('svg', [
      h('g', this.bars.map(bar => h('bar-element', bar))),
      $horizontalAxis,
      $verticalAxis,
      $slots
    ])
  }
}
