import TimelineLite from 'gsap/TimelineLite'
import {queueAnimations, flushAnimations} from '../animation'
import AnimatedGroup from '../hocs/AnimatedGroup'

import Animated from '../animation/directives/v-animated'
import Draw from '../animation/directives/v-draw'
import Morph from '../animation/directives/v-morph'

export default {
  components: {AnimatedGroup},
  directives: {Animated, Draw, Morph},
  props: {
    animationDuration: {
      type: [Number, Function],
      default: 0.66667
    },
    animationStagger: {
      type: Number,
      default: 0
    }
  },
  watch: {
    dataView: {
      handler () {
        if (this.animation) this.animation.kill()
        queueAnimations(this._uid)
        this.$nextTick(function () {
          const tweens = flushAnimations(this._uid)
          if (tweens.length === 0) return
          this.animation = new TimelineLite({
            tweens,
            stagger: this.animationStagger,
            onComplete: () => { this.animation = null }
          })
        })
      },
      immediate: true
    }
  }
}
