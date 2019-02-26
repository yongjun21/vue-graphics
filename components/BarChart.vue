<template>
  <g class="bar-chart" :transform="transform.toString()">
    <g class="bars" v-on="wrapListeners($listeners)">
      <rect v-for="(bar, i) in dataProps" :key="bar.key"
        class="bar"
        :class="bar.class"
        :data-bar-id="i"
        v-animated:[_uid]="getBarAttrs(bar, i)">
      </rect>
    </g>
    <slot v-bind="{transform}"></slot>
  </g>
</template>

<script>
import TimelineLite from 'gsap/TimelineLite'

import {dataPropsMixin, userSpaceMixin} from '../mixins'
import {DomainHelper, TransformHelper} from '../helpers'

import Animated from '../animation/directives/v-animated'
import {queueAnimations, flushAnimations} from '../animation'

export default {
  directives: {Animated},
  mixins: [dataPropsMixin, userSpaceMixin],
  props: {
    x: {
      type: Function,
      required: true
    },
    y: {
      type: Function,
      required: true
    },
    xDomain: {
      type: [Array, Function],
      default: () => DomainHelper.UNIQUE_VALUES
    },
    yDomain: {
      type: [Array, Function],
      default: () => DomainHelper.CLAMPED_MIN_MAX(0)
    },
    horizontal: {
      type: Boolean,
      default: false
    },
    bandWidth: {
      type: Number,
      default: 0.9
    }
  },
  computed: {
    baseTransform () {
      const t = new TransformHelper()
      return this.horizontal ? t.invert() : t.flipY()
    },
    xRange () {
      return [0, this.xDomain_.length]
    },
    yRange () {
      return this.yDomain_
    }
  },
  methods: {
    getBarAttrs (d, i) {
      const {xDomain_, bandWidth} = this
      const xOffset = (1 - bandWidth) / 2
      return {
        x: xDomain_.indexOf(d.x) + xOffset,
        y: 0,
        width: bandWidth,
        height: d.y,
        duration: 0.66667,
        order: i
      }
    },
    wrapListeners ($listeners) {
      const wrapped = {}
      Object.keys($listeners).forEach(key => {
        wrapped[key] = e => {
          const bar = this.dataProps[e.target.getAttribute('data-bar-id')]
          this.$listeners[key](bar, e)
        }
      })
      return wrapped
    }
  },
  watch: {
    data () {
      if (this.animation) this.animation.kill()
      queueAnimations(this._uid)
      this.$nextTick(function () {
        const tweens = flushAnimations(this._uid)
        if (tweens.length === 0) return
        this.animation = new TimelineLite({
          tweens,
          stagger: 0.0166667,
          onComplete: () => { this.animation = null }
        })
      })
    }
  }
}
</script>
