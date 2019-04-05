export const _ASSOCIATED_ = Symbol('associated')

export default {
  bind: associate,
  update: associate
}

export function getAssociated (el) {
  return el[_ASSOCIATED_]
}

function associate (el, binding) {
  el[_ASSOCIATED_] = binding.value
}
