import {BarChart, ResponsiveWrapper, AnimatedBar, StackedBarChart} from '../index.js'

import WaterfallLine from '../examples/WaterfallLine'
import ChordDiagram from '../examples/ChordDiagram'

// testBarChart()
// testWaterfallLine()
testChordDiagram()
// testStackedBar()

function testBarChart () {
  BarChart.components['bar-element'] = AnimatedBar
  window.vm = createVM(BarChart, {data: [10, 20, 50, 40], yDomain: [0, 60]})
}

function testWaterfallLine () {
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
      window.vm = createVM(WaterfallLine, {data, domain: ['1', '2A', '2B', '2C', '2CS']})
    })
}

function testChordDiagram () {
  Papa.parse('visa.csv', {
    header: true,
    dynamicTyping: true,
    download: true,
    complete (parsed) {
      parsed.data.forEach(row => {
        row.id = row.code
        row.label = row.country
        row.group = row.region
      })
      const data = {
        data: parsed.data,
        domain: parsed.data.map(row => row.id),
        groups: ['Asia', 'Europe', 'Americas', 'Africa', 'Oceania'],
        exclude: v => v <= 0,
        padding: 0.15
      }
      window.vm = createVM(ChordDiagram, data, 'chord-diagram')
    }
  })
}

function testStackedBar () {
  window.fetch('progress.json')
    .then(res => res.json())
    .then(json => json['2017']['2B'])
    .then(data => {
      data.forEach(d => {
        d.label = d.school
      })
      window.vm = createVM(StackedBarChart, {
        data,
        domain: ['filled', 'vacancy', 'applicants'],
        yDomain: [0, 400],
        height: data.length * 200,
        paddingInner: 0.4,
        paddingOuter: 0.2,
        horizontal: ''
      })
    })
}

function createVM (Component, data, className) {
  return new Vue({
    el: 'main',
    data,
    render (h) {
      return h(ResponsiveWrapper, {
        class: className,
        scopedSlots: {
          default: sizing => h(Component, {
            props: Object.assign(sizing, this.$data)
          })
        }
      })
    }
  })
}
