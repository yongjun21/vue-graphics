polyfill()

function polyfill () {
  if ('classList' in SVGElement.prototype) return
  Object.defineProperty(SVGElement.prototype, 'classList', {
    get () {
      const el = this
      return {
        add (...args) {
          const classArr = el.getAttribute('class').split(' ')
          args.forEach(arg => {
            if (!classArr.includes(arg)) classArr.push(arg)
          })
          el.setAttribute('class', classArr.join(' '))
        },
        remove (...args) {
          const classArr = el.getAttribute('class').split(' ')
            .filter(cls => !args.includes(cls))
          el.setAttribute('class', classArr.join(' '))
        }
      }
    }
  })
}
