export function SUBSET (scale, start, stop) {
  const domain = scale.domain()
  const startIndex = domain.indexOf(start)
  const stopIndex = domain.indexOf(stop)
  const min = Math.min(startIndex, stopIndex)
  const max = Math.max(startIndex, stopIndex)
  const subset = domain.filter((v, i) => i >= min && i <= max)
  if (startIndex > stopIndex) subset.reverse()
  const range = [scale(start), scale(stop)]
  if (startIndex > stopIndex) range[0] += scale.bandwidth()
  else range[1] += scale.bandwidth()
  const subScale = scale
    .copy()
    .domain(subset)
    .range(range)
  return subScale.paddingOuter ? subScale.paddingOuter(0) : subScale.padding(0)
}
