import TimelineLite from 'gsap/TimelineLite'
import {ObserveVisibility} from 'vue-observe-visibility'
import {_ANIMATE_, queueAnimations, flushAnimations, defaultConfig} from './shared'

import AnimatedGroup from './hocs/AnimatedGroup'
import Animated from './directives/v-animated'
import Draw from './directives/v-draw'
import Morph from './directives/v-morph'

const _ANIMATION_ = Symbol('active animation')

export default {
  components: {AnimatedGroup},
  directives: {Animated, Draw, Morph},
  props: {
    animationGroup: {
      type: [String, Number, Symbol],
      default () {
        return this._uid
      }
    },
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
        group: this.animationGroup,
        duration: this.animationDuration,
        order
      }
    },
    animate () {
      if (arguments.length > 0) {
        if (this[_ANIMATION_]) return
        const tweens = Array.prototype.map.call(
          this.$el.querySelectorAll('.vg-animated, [data-vg-animated]'),
          el => el[_ANIMATE_].apply(el, arguments)
        ).filter(t => t != null)
        if (tweens.length === 0) return
        this[_ANIMATION_] = new TimelineLite({
          tweens,
          stagger: this.animationStagger,
          onComplete: () => { this[_ANIMATION_] = null }
        })
      } else {
        if (this[_ANIMATION_]) this[_ANIMATION_].pause()
        queueAnimations(this.animationGroup)
        this.$nextTick(function () {
          const tweens = flushAnimations(this.animationGroup)
          if (tweens.length > 0) {
            if (this[_ANIMATION_]) this[_ANIMATION_].kill()
            this[_ANIMATION_] = new TimelineLite({
              tweens,
              stagger: this.animationStagger,
              onComplete: () => { this[_ANIMATION_] = null }
            })
          } else {
            if (this[_ANIMATION_]) this[_ANIMATION_].play()
          }
        })
      }
    }
  },
  watch: {
    dataView: {
      handler () {
        this.animate()
      },
      immediate: true
    }
  },
  mounted () {
    if (this.appear) {
      let wasVisible = true
      ObserveVisibility.bind(this.$el, {
        value: (isVisible, entry) => {
          if (!wasVisible && isVisible) this.animate(this.appear, null, true)
          wasVisible = isVisible
        }
      }, {context: this})
    }
  }
}
