import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import VuePlugin from 'rollup-plugin-vue'

const config = {
  external: [
    'vue',
    'd3-scale',
    'd3-shape',
    'd3-path',
    'd3-interpolate-path',
    'gsap/TweenLite',
    'gsap/TimelineLite',
    'gsap/AttrPlugin'
  ],
  output: {
    format: 'cjs',
    sourcemap: true
  },
  plugins: [
    babel({
      presets: ['@babel/preset-env']
    }),
    resolve(),
    commonjs(),
    VuePlugin({
      css: false
    })
  ]
}

export default args => {
  const filename = args.input.match(/\/?(\w+)\.\w+$/)[1]
  config.output.file = `dist/${filename}.js`
  return config
}
