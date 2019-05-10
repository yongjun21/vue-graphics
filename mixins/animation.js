import TimelineLite from 'gsap/TimelineLite'
import {queueAnimations, flushAnimations, defaultConfig} from '../animation'
import AnimatedGroup from '../hocs/AnimatedGroup'

import Animated from '../animation/directives/v-animated'
import Draw from '../animation/directives/v-draw'
import Morph from '../animation/directives/v-morph'

const _ANIMATION_ = Symbol('animation')

export default {
  components: {AnimatedGroup},
  directives: {Animated, Draw, Morph},
  props: {
    appear: null,
    animationGroup: [String, Number, Symbol],
    animationDuration: {
      type: [Number, Function],
      default: defaultConfig.duration
    },
    animationStagger: {
      type: Number,
      default: 0
    }
  },
  methods: {
    getAnimation (order) {
      return {
        group: this.animationGroup || this._uid,
        duration: this.animationDuration,
        order
      }
    },
    animate () {
      if (this[_ANIMATION_]) this[_ANIMATION_].kill()
      queueAnimations(this.animationGroup || this._uid)
      this.$nextTick(function () {
        const tweens = flushAnimations(this.animationGroup || this._uid)
        if (tweens.length === 0) return
        this[_ANIMATION_] = new TimelineLite({
          tweens,
          stagger: this.animationStagger,
          onComplete: () => { this[_ANIMATION_] = null }
        })
      })
    }
  },
  watch: {
    dataView: 'animate'
  },
  created () {
    if (this.appear != null) this.animate()
  }
}
