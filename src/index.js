import BarChart from './components/SampleBarChart'
import ResponsiveWrapper from './components/hocs/ResponsiveWrapper'

window.vm = new Vue({
  el: '#app',
  components: {BarChart, ResponsiveWrapper}
})
