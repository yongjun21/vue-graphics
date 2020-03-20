import '../../polyfills/Element.prototype.closest'
import TimelineLite from 'gsap/TimelineLite'
import {ObserveVisibility} from 'vue-observe-visibility'
import {animate, retrieveTweens} from '../shared'

const _ACTIVE_ = Symbol('active tweens')

export default {
  name: 'AnimatedGroup',
  inject: {
    animationStagger: {default: 0}
  },
  props: {
    watching: null,
    enter: Object,
    exit: Object,
    appear: Object,
    stagger: {
      type: Number,
      default () {
        return this.animationStagger
      }
    }
  },
  computed: {
    listeners () {
      const {enter, exit} = this
      const listeners = {}
      if (enter) {
        listeners.enter = function (el, done) {
          animate(el, enter, done, true) || done()
        }
      }
      if (exit) {
        listeners.leave = function (el, done) {
          animate(el, exit, done, false) || done()
        }
      }
      return listeners
    }
  },
  methods: {
    animate () {
      if (arguments.length > 0) {
        if (this[_ACTIVE_]) return
        const tweens = Array.prototype.map.call(
          this.$el.children,
          el => animate(el, ...arguments)
        ).filter(t => t != null)
        if (tweens.length === 0) return
        this[_ACTIVE_] = new TimelineLite({
          tweens,
          stagger: this.stagger,
          onComplete: () => { this[_ACTIVE_] = null }
        })
      } else {
        if (this[_ACTIVE_]) this[_ACTIVE_].pause()
        this.$nextTick(function () {
          const tweens = retrieveTweens(this.$el.children)
          if (tweens.length > 0) {
            if (this[_ACTIVE_]) this[_ACTIVE_].kill()
            this[_ACTIVE_] = new TimelineLite({
              tweens,
              stagger: this.stagger,
              onComplete: () => { this[_ACTIVE_] = null }
            })
          } else {
            if (this[_ACTIVE_]) this[_ACTIVE_].play()
          }
        })
      }
    }
  },
  watch: {
    watching: {
      handler () {
        this.animate()
      },
      immediate: true
    }
  },
  mounted () {
    if (this.appear) {
      let wasVisible = true
      ObserveVisibility.bind(this.$el.closest('svg'), {
        value: (isVisible, entry) => {
          if (!wasVisible && isVisible) this.animate(this.appear, null, true)
          wasVisible = isVisible
        }
      }, {context: this})
    }
  },
  render (h) {
    const $children = this.$scopedSlots.default && this.$scopedSlots.default()
    return h('transition-group', {
      props: {tag: 'g', appear: ''},
      on: this.listeners
    }, $children)
  }
}
