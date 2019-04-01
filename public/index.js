/* globals Vue */

import {ResponsiveWrapper, SvgWithPadding} from '../index.js'

import BarChart from '../examples/BarChart.vue'
import StackedBarChart from '../examples/StackedBarChart.vue'
import WaterfallLine from '../examples/WaterfallLine'
import ChordDiagram from '../examples/ChordDiagram'

// TouchEmulator()

// testBarChart()
// testWaterfallLine()
// testChordDiagram()
testStackedBar()

function testBarChart () {
  window.vm = createVM2(BarChart, {
    data: [10, 20, 50, 40],
    x: (d, i) => i,
    y: (d, i) => d
  }, {
    on: {
      mouseover: console.log
    }
  })
}

function testWaterfallLine () {
  window.fetch('waterfall.json')
    .then(res => res.json())
    .then(json => json['2017'])
    .then(data => {
      data = data.filter(d => Object.keys(d).length > 1)
      data.forEach(d => {
        if (d.id === '__OVERALL__') d.class = 'overall'
      })
      window.vm = createVM(WaterfallLine, {
        data,
        domain: ['1', '2A', '2B', '2C', '2CS'],
        interactives: (f, id) => {
          return {
            mouseover: f(id, true),
            mouseout: f(id, false)
          }
        }
      })
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
      const tallData = []
      data.forEach(row => {
        tallData.push({year: row.year, category: 'filled', count: row['filled']})
        tallData.push({year: row.year, category: 'vacancy', count: row['vacancies']})
        tallData.push({year: row.year, category: 'remaining', count: row['places'] - row['filled'] - row['vacancies']})
      })
      window.vm = createVM2(StackedBarChart, {
        data: tallData,
        x: d => d.year,
        y: d => d.count,
        g: d => d.category,
        c: d => d.category,
        horizontal: true,
        bandWidth: 0.5
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

function createVM2 (Component, data, options) {
  return new Vue({
    el: 'main',
    data,
    render (h) {
      return h(SvgWithPadding, {
        scopedSlots: {
          default: sizing => h(Component, Object.assign({
            attrs: Object.assign(sizing, this.$data)
          }, options))
        }
      })
    }
  })
}
