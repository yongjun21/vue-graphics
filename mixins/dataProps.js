import {DomainHelper} from '../helpers'

export default {
  props: {
    data: {
      type: Array,
      required: true
    },
    x: Function,
    y: Function,
    k: Function,
    c: Function,
    xDomain: {
      type: [Array, Function],
      default: () => DomainHelper.MIN_MAX
    },
    yDomain: {
      type: [Array, Function],
      default: () => DomainHelper.MIN_MAX
    }
  },
  computed: {
    dataProps () {
      const {x, y, k, c} = this
      return this.data.map((d, i) => {
        return {
          key: k && k(d, i),
          class: c && c(d, i),
          x: x && x(d, i),
          y: y && y(d, i)
        }
      })
    },
    xDomain_ () {
      if (typeof this.xDomain !== 'function') return this.xDomain
      const values = this.data.map(this.x)
      return this.xDomain(values)
    },
    yDomain_ () {
      if (typeof this.yDomain !== 'function') return this.yDomain
      const values = this.data.map(this.y)
      return this.yDomain(values)
    }
  }
}
