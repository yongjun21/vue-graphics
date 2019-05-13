/* globals Vue, d3 */

import {SvgWithPadding} from '../hocs'

import BarChart from '../examples/BarChart.vue'
import StackedBarChart from '../examples/StackedBarChart.vue'
import GroupedBarChart from '../examples/GroupedBarChart.vue'
import ChordDiagram from '../examples/ChordDiagram.vue'
import WaterfallChart from '../examples/WaterfallChart.vue'

// TouchEmulator()

// testBarChart()
// testWaterfallChart()
testChordDiagram()
// testStackedBar()
// testGroupedBar()

function testBarChart () {
  window.vm = createVM(BarChart, {
    data: [10, 20, 50, 40],
    x: (d, i) => i,
    y: (d, i) => d
  }, {
    mouseover: console.log,
    mouseout: console.log
  })
}

function testWaterfallChart () {
  window.fetch('waterfall.json')
    .then(res => res.json())
    .then(json => json['2017'])
    .then(data => {
      const groups = ['1', '2A', '2B', '2C', '2CS']
      const tallData = []
      data.forEach(d => {
        if (Object.keys(d).length <= 1) return
        let y = 0
        tallData.push({x: '0', y, g: d.id})
        groups.forEach(x => {
          y += d[x]
          tallData.push({x, y, g: d.id})
        })
      })
      window.vm = createVM(WaterfallChart, {
        data: tallData
      }, null, {height: 800})
    })
}

function testChordDiagram () {
  d3.csv('visa.csv').then(json => {
    window.vm = createVM(ChordDiagram, {
      data: json,
      k: 'code',
      a: 'country',
      g: 'region',
      gDomain: ['Asia', 'Europe', 'Americas', 'Africa', 'Oceania']
    }, null, {height: 800})
  })
}

function testStackedBar () {
  window.fetch('https://k57kq477w1.execute-api.ap-southeast-1.amazonaws.com/development?school=AI TONG SCHOOL&phase=2B&runs=0')
    .then(res => res.json())
    .then(json => {
      const data = json.historical
      const tallData = []
      data.forEach(row => {
        tallData.push({year: row.year, category: 'filled', count: row['filled']})
        tallData.push({year: row.year, category: 'vacancy', count: row['vacancies']})
        tallData.push({year: row.year, category: 'remaining', count: row['places'] - row['filled'] - row['vacancies']})
      })
      window.vm = createVM(StackedBarChart, {
        data: tallData,
        x: 'year',
        y: 'count',
        g: 'category',
        c: 'category',
        horizontal: true,
        padding: 0.5
      })
    })
}

function testGroupedBar () {
  window.fetch('https://k57kq477w1.execute-api.ap-southeast-1.amazonaws.com/development?school=AI TONG SCHOOL&phase=2B&runs=0')
    .then(res => res.json())
    .then(json => {
      const data = json.historical
      const tallData = []
      data.forEach(row => {
        tallData.push({year: row.year, category: 'filled', count: row['filled']})
        tallData.push({year: row.year, category: 'vacancy', count: row['vacancies']})
        tallData.push({year: row.year, category: 'remaining', count: row['places'] - row['filled'] - row['vacancies']})
      })
      window.vm = createVM(GroupedBarChart, {
        data: tallData,
        x: 'year',
        y: 'count',
        g: 'category',
        c: 'category',
        horizontal: true,
        padding: 0.4
      })
    })
}

function createVM (Component, props, listeners, svgProps) {
  return new Vue({
    el: 'main',
    data: props,
    render (h) {
      return h(SvgWithPadding, {
        props: svgProps,
        scopedSlots: {
          default: sizing => h(Component, {
            attrs: Object.assign(sizing, this.$data),
            on: listeners
          })
        }
      })
    }
  })
}
