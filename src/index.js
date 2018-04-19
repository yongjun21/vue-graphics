import BarChart from './components/BarChart'
import WaterfallLine from './components/WaterfallLine'
import ResponsiveWrapper from './components/hocs/ResponsiveWrapper'

window.fetch('waterfall.json')
  .then(res => res.json())
  .then(json => json['2017'])
  .then(data => {
    data = data.filter(d => Object.keys(d).length > 1)
    data.forEach(d => {
      if (d.id === '__OVERALL__') {
        d.class = {overall: true}
        d.highlight = {class: {overall: true}}
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
