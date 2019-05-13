import fs from 'fs'
import path from 'path'

// import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import VuePlugin from 'rollup-plugin-vue'

const inputDir = path.join(__dirname, 'examples')

export default {
  external: [
    'vue',
    'd3-scale',
    'd3-shape/src/line',
    'd3-shape/src/curve/linear',
    'd3-shape/src/curve/step',
    'd3-path',
    'd3-interpolate-path',
    'gsap/TweenLite',
    'gsap/TimelineLite',
    'vue-observe-visibility'
  ],
  input: fs.readdirSync(inputDir).map(filename => path.join(inputDir, filename)),
  output: {
    format: 'esm',
    dir: 'dist',
    entryFileNames: '[name].mjs',
    preferConst: true,
    sourcemap: true
  },
  plugins: [
    // babel({
    //   presets: ['@babel/preset-env']
    // }),
    resolve(),
    commonjs(),
    VuePlugin({
      css: false
    })
  ]
}
