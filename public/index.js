import {BarChart, ResponsiveWrapper, AnimatedBar} from '../index.js'

import StackedBarChart from '../components/withAxis/StackedBarChart'
import WaterfallLine from '../examples/WaterfallLine'
import ChordDiagram from '../examples/ChordDiagram'

// testBarChart()
// testWaterfallLine()
testChordDiagram()
// testStackedBar()

function testBarChart () {
  BarChart.components = {'bar-element': AnimatedBar}
  window.vm = createVM(BarChart, {data: [10, 20, 50, 40], range: [0, 60]})
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
      const groups = ['Asia', 'Europe', 'Americas', 'Africa', 'Oceania']
      const groupedData = {}

      parsed.data.forEach(row => {
        row.id = row.code
        row.label = row.country
        row.group = row.region

        groupedData[row.group] = groupedData[row.group] || []
        groupedData[row.group].push(row.id)
      });

      ['Americas', 'Africa', 'Oceania'].forEach(region => {
        groupedData[region].reverse()
      })

      const domain = Object.keys(groupedData).reduce((arr, g) => {
        return arr.concat(groupedData[g])
      }, [])

      const data = {
        data: parsed.data,
        domain,
        groups,
        exclude: v => v <= 1
      }
      window.vm = createVM(ChordDiagram, data, {
        class: 'chord-diagram',
        props: {
          padding: '20%'
        }
      })
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
        height: 60 * data.length + 18,
        paddingInner: 0.3,
        paddingOuter: 0.3,
        horizontal: '',
        xLabel: 'Places',
        yLabel: 'Year'
      }, {
        class: 'stacked-bar',
        props: {
          padding: '20 20 20 100'
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
