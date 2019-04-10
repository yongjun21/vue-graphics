export default function SplitApplyCombine (data) {
  const indexes = new Map()
  const applied = []
  const wrapped = Object.assign([...data], {
    split (by, alias) {
      if (typeof by === 'string') {
        alias = by
        by = d => d[alias]
      }
      indexes.set(alias || by, getIndexes(data, by))
      return this
    },
    apply (cb) {
      applied.push(cb)
      return this
    },
    combine (returnOriginal) {
      const combined = []
      this.groups.forEach((members, group) => {
        applied.forEach(cb => {
          cb(members, group)
        })
        combined.push(group)
      })
      return SplitApplyCombine(returnOriginal ? data : combined)
    }
  })
  Object.defineProperty(wrapped, 'groups', {
    get () {
      const selections = [...indexes].map(([key, values]) => {
        return [...values].map(([value, index]) => [key, value, index])
      })
      const combinations = getCombinations(selections)
      const groups = new Map()
      combinations.forEach(combination => {
        const group = {}
        let match = null
        combination.forEach(([key, value, index]) => {
          if (typeof key !== 'function') group[key] = value
          match = intersect(match, index)
        })
        const members = match != null ? match.map(i => data[i]) : data
        groups.set(group, members)
      })
      return groups
    }
  })
  return Object.freeze(wrapped)
}

function getIndexes (data, by) {
  const indexes = new Map()
  data.forEach((d, i) => {
    const key = by(d)
    const value = indexes.get(key) || []
    value.push(i)
    indexes.set(key, value)
  })
  return indexes
}

function getCombinations (sets) {
  if (sets.length === 0) return [[]]
  const combinations = []
  const divisors = sets.reduce((arr, set) => {
    return arr.map(v => v * set.length).concat(1)
  }, [])
  const n = divisors[0] * sets[0].length
  for (let k = 0; k < n; k++) {
    let remainder = k
    const combination = divisors.map((divisor, i) => {
      const j = Math.floor(remainder / divisor)
      remainder = remainder - j * divisor
      return sets[i][j]
    })
    combinations.push(combination)
  }
  return combinations
}

function intersect (A, B) {
  if (A == null) return B
  const intersection = []
  let i = 0
  let j = 0
  while (i < A.length && j < B.length) {
    if (A[i] < B[j]) i++
    else if (A[i] > B[j]) j++
    else {
      intersection.push(A[i])
      i++
      j++
    }
  }
  return intersection
}
