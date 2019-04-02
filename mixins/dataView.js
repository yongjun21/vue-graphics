import {DomainHelper} from '../helpers'

export default {
  props: {
    data: {
      type: Array,
      required: true
    },
    x: [Function, String, Number],
    y: [Function, String, Number],
    g: [Function, String, Number],
    k: [Function, String, Number],
    c: [Function, String, Number],
    xDomain: {
      type: [Function, Array],
      default: DomainHelper.UNIQUE('x')
    },
    yDomain: {
      type: [Function, Array],
      default: DomainHelper.MINMAX('y')
    },
    gDomain: {
      type: [Function, Array],
      default: DomainHelper.UNIQUE('g')
    }
  },
  computed: {
    dataView () {
      const {x, y, g, k, c} = this
      const toApply = []
      if (k) toApply.push(['key', get(k)])
      if (c) toApply.push(['class', get(c)])
      if (x) toApply.push(['x', get(x)])
      if (y) toApply.push(['y', get(y)])
      if (g) toApply.push(['g', get(g)])
      return this.data.map((d, i) => {
        const props = {}
        toApply.forEach(([key, accessor]) => {
          props[key] = accessor(d, i)
        })
        props.datum = d
        props.index = i
        return props
      })
    },
    domain () {
      const domain = {}
      const propKeys = ['x', 'y', 'g']
      propKeys.forEach(key => {
        if (key in this) {
          const propDomain = this[key + 'Domain']
          if (typeof propDomain !== 'function') domain[key] = propDomain
          else domain[key] = propDomain(this.dataView)
        }
      })
      return domain
    }
  }
}

function get (key) {
  return typeof key === 'function' ? key : d => d[key]
}
