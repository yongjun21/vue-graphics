/* globals Vue */

import {ResponsiveWrapper, SvgWithPadding} from '../hocs'

import BarChart from '../examples/BarChart.vue'
import StackedBarChart from '../examples/StackedBarChart.vue'
import ChordDiagram from '../examples/ChordDiagram.vue'
import WaterfallLine from '../examples/WaterfallLine'

// TouchEmulator()

// testBarChart()
// testWaterfallLine()
testChordDiagram()
// testStackedBar()

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
      const data = {
        data: parsed.data,
        k: d => d.code,
        a: d => d.country,
        g: d => d.region,
        gDomain: ['Asia', 'Europe', 'Americas', 'Africa', 'Oceania']
      }
      window.vm = createVM2(ChordDiagram, data, null, {props: {height: 800}})
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
        padding: 0.5
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

function createVM2 (Component, data, options, svgOptions) {
  return new Vue({
    el: 'main',
    data,
    render (h) {
      return h(SvgWithPadding, Object.assign({
        scopedSlots: {
          default: sizing => h(Component, Object.assign({
            attrs: Object.assign(sizing, this.$data)
          }, options))
        }
      }, svgOptions))
    }
  })
}
