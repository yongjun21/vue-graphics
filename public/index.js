import {BarChart, ResponsiveWrapper, AnimatedBar, StackedBarChart} from '../index.js'

import WaterfallLine from '../examples/WaterfallLine'
import ChordDiagram from '../examples/ChordDiagram'

// testBarChart()
// testWaterfallLine()
// testChordDiagram()
testStackedBar()

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
      window.vm = createVM(ChordDiagram, data, {class: 'chord-diagram'})
    }
  })
}

function testStackedBar () {
  window.fetch('https://eqrox04mbk.execute-api.ap-southeast-1.amazonaws.com/development?school=AI TONG SCHOOL&phase=2B&runs=0')
    .then(res => res.json())
    .then(json => {
      const data = json.historical
      data.forEach(row => {
        row.label = row.year
        row.vacancyRemaining = row.places - row.filled - row.vacancy
      })
      window.vm = createVM(StackedBarChart, {
        data,
        domain: ['filled', 'vacancy', 'vacancyRemaining'],
        yDomain: [0, 400],
        paddingInner: 0.4,
        paddingOuter: 0.2,
        horizontal: ''
      }, {
        class: 'stacked-bar',
        props: {
          paddingTop: 20,
          paddingBottom: 20,
          paddingLeft: 100,
          paddingRight: 20
        }
      })
    })
}

function createVM (Component, data, options) {
  return new Vue({
    el: 'main',
    data,
    render (h) {
      return h(ResponsiveWrapper, Object.assign({
        scopedSlots: {
          default: sizing => h(Component, {
            props: Object.assign(sizing, this.$data)
          })
        }
      }, options))
    }
  })
}
