const associatedData = new WeakMap()

export default {
  bind: associate,
  update: associate,
  unbind (el) {
    associatedData.delete(el)
  }
}

export function getAssociated (el) {
  return associatedData.get(el)
}

function associate (el, binding) {
  associatedData.set(el, binding.value)
}
