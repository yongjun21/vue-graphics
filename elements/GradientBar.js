export default {
  functional: true,
  render (h, {props}) {
    const steps = []
    const interpolator = getInterpolator(props.scale.domain())
    for (let n = 0; n < 100; n++) {
      steps.push(props.scale(interpolator(n / 100)).hex())
    }
    const $steps = steps.map((hex, i) => h('div', {
      key: i,
      style: {
        backgroundColor: hex,
        flexBasis: '1%'
      }
    }))
    return h('div', {
      class: props.class,
      style: Object.assign({display: 'flex'}, props.style)
    }, $steps)
  }
}

function getInterpolator (domain) {
  const domainStart = domain[0]
  const domainEnd = domain[domain.length - 1]
  return z => (1 - z) * domainStart + z * domainEnd
}
