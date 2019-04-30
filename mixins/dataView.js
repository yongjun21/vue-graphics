export default {
  props: {
    data: {
      type: Array,
      required: true
    },
    k: [Function, String, Number],
    c: [Function, String, Number]
  },
  computed: {
    dataView () {
      const keys = ['x', 'x1', 'x2', 'y', 'y1', 'y2', 'a', 'a1', 'a2', 'r', 'r1', 'r2', 'g', 's']
      const toApply = []
      if (this.k) toApply.push(['key', get(this.k)])
      if (this.c) toApply.push(['class', get(this.c)])
      keys.forEach(key => {
        if (this[key]) toApply.push([key, get(this[key])])
      })
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
      const propKeys = ['x', 'y', 'g', 'a', 'r']
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
