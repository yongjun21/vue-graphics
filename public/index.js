import {BarChart, WaterfallLine, ResponsiveWrapper} from '../index.js'

window.fetch('waterfall.json')
  .then(res => res.json())
  .then(json => json['2017'])
  .then(data => {
    data = data.filter(d => Object.keys(d).length > 1)
    data.forEach(d => {
      d.class = 'base'
      d.highlight = {class: 'highlight'}
      if (d.id === '__OVERALL__') {
        d.class = 'overall'
        d.highlight = {class: 'overall'}
      }
    })
    window.vm = new Vue({
      el: '#app',
      components: {BarChart, WaterfallLine, ResponsiveWrapper},
      data: {
        data,
        domain: ['1', '2A', '2B', '2C', '2CS']
      }
    })
  })
