import Associate, {getAssociated} from '../directives/v-associate'
import {wrapListeners} from '../util'

export default {
  directives: {Associate},
  computed: {
    wrappedListeners () {
      return wrapListeners(this.$listeners, getAssociated)
    }
  }
}
