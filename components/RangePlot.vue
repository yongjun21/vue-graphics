<template>
  <g class="vg-plot vg-range-plot">
    <animated-group
      :watching="dataView"
      :enter="enterGeom"
      :exit="exitGeom"
      :appear="enterGeom">
      <range-element v-for="(d, i) in dataView.filter(hasGeom)" :key="d.key || i"
        :class="d.class"
        v-bind="getGeom(d, i)">
      </range-element>
    </animated-group>
    <slot v-bind="{getGeom, hasGeom}"></slot>
  </g>
</template>

<script>
import {makeAnimated} from '../animation'
import {animationMixin} from '../mixins'

const RangeElement = {
  functional: true,
  props: {
    y0: {
      type: Number,
      required: true
    },
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    },
    r1: Number,
    r2: Number
  },
  render (h, {props}) {
    return h('g', {
      attrs: {
        transform: `translate(0 ${props.y0})`
      }
    }, [
      renderLine(h, props),
      props.r1 && renderDot(h, props, true),
      props.r2 && renderDot(h, props, false)
    ])
  }
}

function renderLine (h, props) {
  return h('line', {
    class: 'vg-line',
    attrs: {
      x1: props.x,
      x2: props.x,
      y1: 0,
      y2: props.y
    }
  })
}

function renderDot (h, props, fixed) {
  return h('circle', {
    class: ['vg-dot', fixed ? 'vg-one' : 'vg-two'],
    attrs: {
      cx: props.x,
      cy: fixed ? 0 : props.y,
      r: fixed ? props.r1 : props.r2
    }
  })
}

export default {
  name: 'RangePlot',
  components: {
    RangeElement: makeAnimated(RangeElement, ['x', 'y', 'y0'])
  },
  mixins: [animationMixin],
  props: {
    dataView: {
      type: Array,
      required: true
    },
    xScale: {
      type: Function,
      required: true
    },
    yScale: {
      type: Function,
      default: v => v
    }
  },
  computed: {
    enterGeom () {
      return {
        y: 0,
        animation: this.getAnimation(Infinity)
      }
    },
    exitGeom () {
      return {
        y: 0,
        animation: this.getAnimation(-Infinity)
      }
    }
  },
  methods: {
    getGeom (d, i) {
      const {xScale, yScale} = this
      let y0 = yScale(d.y1)
      let y1 = yScale(d.y2)
      if (yScale.bandwidth) {
        const yRange = yScale.range()
        if (yRange[0] > yRange[yRange.length - 1]) {
          if (y1 <= y0) y0 += yScale.bandwidth()
          else y1 += yScale.bandwidth()
        } else {
          if (y1 >= y0) y1 += yScale.bandwidth()
          else y0 += yScale.bandwidth()
        }
      }
      return {
        x: xScale(d.x),
        y: y1 - y0,
        y0,
        r1: d.r1,
        r2: d.r2,
        animation: this.getAnimation(i)
      }
    },
    hasGeom (d) {
      return this.xScale(d.x) != null && this.yScale(d.y1) != null && this.yScale(d.y2) != null
    }
  }
}
</script>
