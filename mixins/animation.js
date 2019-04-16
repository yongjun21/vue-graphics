import TimelineLite from 'gsap/TimelineLite'
import {_ANIMATION_, queueAnimations, flushAnimations} from '../animation'

import Animated from '../animation/directives/v-animated'
import Draw from '../animation/directives/v-draw'
import Morph from '../animation/directives/v-morph'

export default {
  directives: {Animated, Draw, Morph},
  watch: {
    dataView: {
      handler () {
        if (this[_ANIMATION_]) this[_ANIMATION_].kill()
        queueAnimations(this._uid)
        this.$nextTick(function () {
          const tweens = flushAnimations(this._uid)
          if (tweens.length === 0) return
          this[_ANIMATION_] = new TimelineLite({
            tweens,
            stagger: 0,
            onComplete: () => { this[_ANIMATION_] = null }
          })
        })
      },
      immediate: true
    }
  }
}
