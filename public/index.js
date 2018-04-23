import {BarChart, WaterfallLine, ChordDiagram, ResponsiveWrapper} from '../index.js'

/*
window.vm = new Vue({
  el: '#app',
  components: {BarChart, ResponsiveWrapper},
  data: {
    data: [10, 20, 50, 40],
    domain: [0, 60]
  }
})
*/

/*
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
      components: {WaterfallLine, ResponsiveWrapper},
      data: {
        data,
        domain: ['1', '2A', '2B', '2C', '2CS']
      }
    })
  })
*/

Papa.parse('visa.csv', {
  header: true,
  dynamicTyping: true,
  download: true,
  complete (parsed) {
    parsed.data.forEach(row => {
      row.id = row.code
    })
    window.vm = new Vue({
      el: '#app',
      components: {ChordDiagram, ResponsiveWrapper},
      data: {
        data: parsed.data,
        domain: parsed.data.map(row => row.id)
      }
    })
  }
})
