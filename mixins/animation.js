import TimelineLite from 'gsap/TimelineLite'
import {queueAnimations, flushAnimations} from '../animation'

import Animated from '../animation/directives/v-animated'

export default {
  directives: {Animated},
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
