import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: 'public/index.js',
  external: ['d3-scale', 'd3-shape', 'd3-path', 'gsap/TweenLite', 'gsap/TimelineLite'],
  output: {
    file: 'public/bundle.js',
    format: 'iife',
    globals: {
      'd3-scale': 'd3',
      'd3-shape': 'd3',
      'd3-path': 'd3',
      'gsap/TweenLite': 'TweenLite',
      'gsap/TimelineLite': 'TimelineLite'
    }
  },
  plugins: [
    resolve(),
    commonjs({include: ['node_modules/hammerjs/**']})
  ]
}
