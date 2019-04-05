export const _ANIMATION_ = Symbol('animation')
export const _TRANSFORMATION_ = Symbol('transformation')

export const currentAnimations = {}
export const config = {}

export function queueAnimations (...names) {
  if (names.length > 0) {
    names.forEach(name => {
      currentAnimations[name] = []
    })
  } else {
    currentAnimations['default'] = []
  }
}

export function flushAnimations (name = 'default') {
  if (!(name in currentAnimations)) return []
  const queued = currentAnimations[name]
  delete currentAnimations[name]
  return queued.sort((a, b) => a[0] - b[0]).map(r => r[1])
}
