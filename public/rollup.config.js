import replace from 'rollup-plugin-replace'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import VuePlugin from 'rollup-plugin-vue'

export default {
  input: 'public/index.js',
  external: [
    'vue',
    'd3-scale',
    'd3-shape/src/line',
    'd3-shape/src/curve/linear',
    'd3-shape/src/curve/step',
    'd3-path',
    'd3-interpolate-path',
    'gsap/TweenLite',
    'gsap/TimelineLite'
  ],
  output: {
    file: 'public/bundle.js',
    format: 'iife',
    globals: {
      'vue': 'Vue',
      'd3-scale': 'd3',
      'd3-shape/src/line': 'd3.line',
      'd3-shape/src/curve/linear': 'd3.curveLinear',
      'd3-shape/src/curve/step': 'd3',
      'd3-path': 'd3',
      'd3-interpolate-path': 'd3',
      'gsap/TweenLite': 'TweenLite',
      'gsap/TimelineLite': 'TimelineLite'
    },
    preferConst: true
  },
  plugins: [
    replace({'stepBefore as curveStepBefore': 'curveStepBefore'}),
    resolve(),
    commonjs(),
    VuePlugin()
  ]
}
