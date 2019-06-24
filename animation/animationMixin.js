import {defaultConfig} from './shared'

import AnimatedGroup from './hocs/AnimatedGroup'
import Animated from './directives/v-animated'
import Draw from './directives/v-draw'
import Morph from './directives/v-morph'

export default {
  components: {AnimatedGroup},
  directives: {Animated, Draw, Morph},
  provide () {
    return {
      animationStagger: this.animationStagger
    }
  },
  props: {
    animationDuration: {
      type: [Number, Function],
      default: defaultConfig.duration
    },
    animationEase: {
      type: Function,
      default: defaultConfig.ease
    },
    animationStagger: {
      type: Number,
      default: 0
    }
  },
  methods: {
    getAnimation (order) {
      return {
        duration: this.animationDuration,
        ease: this.animationEase,
        order
      }
    }
  }
}
