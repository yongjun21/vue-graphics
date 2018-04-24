import {BarChart, WaterfallLine, ChordDiagram, ResponsiveWrapper} from '../index.js'

// testBarChart()
// testWaterfallLine()
testChordDiagram()

function testBarChart () {
  window.vm = createVM(BarChart, [10, 20, 50, 40], [0, 60])
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
      window.vm = createVM(WaterfallLine, data, ['1', '2A', '2B', '2C', '2CS'])
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
      })
      window.vm = createVM(
        ChordDiagram,
        parsed.data,
        parsed.data.map(row => row.id)
      )
    }
  })
}

function createVM (Component, data, domain) {
  return new Vue({
    el: 'main',
    provide: {
      test: 'abc'
    },
    components: {ChordDiagram, ResponsiveWrapper},
    data: {data, domain},
    render (h) {
      return h(ResponsiveWrapper, {
        scopedSlots: {
          default: sizing => h(Component, {
            props: Object.assign(sizing, this.$data)
          })
        }
      })
    }
  })
}
