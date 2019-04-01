import Associate, {getAssociated} from '../directives/v-associate'

export default {
  directives: {Associate},
  methods: {
    wrapListeners ($listeners) {
      const wrapped = {}
      Object.keys($listeners).forEach(key => {
        wrapped[key] = e => {
          const data = getAssociated(e.target)
          $listeners[key](data, e)
        }
      })
      return wrapped
    }
  }
}
