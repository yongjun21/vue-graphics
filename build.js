const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const rollup = require('rollup')

const peerDependencies = Object.keys(require('./package.json').peerDependencies)

const fileList = getFileList('src').filter(file => /\.js$/.test(file))
const configs = fileList.map(inputFile => {
  const outputFile = inputFile.replace(/^src/, 'dist')
  const dir = outputFile.match(/(.+)\//)[1]
  mkdirp.sync(dir)
  return {
    input: inputFile,
    external: id => peerDependencies.some(dep => id.startsWith(dep)),
    output: {
      format: 'es',
      file: outputFile
    }
  }
})

// function build () {
//   return Promise.all(configs.map(async config => {
//     try {
//       const bundle = await rollup.rollup(config)
//       await bundle.write(config.output)
//     } catch (err) {
//       console.log('Error in', config.input)
//       console.error(err)
//     }
//   }))
// }

function watch () {
  const watchMode = process.argv[2] === '-w'
  const watcher = rollup.watch(configs)
  watcher.on('event', event => {
    if (event.code === 'BUNDLE_START') console.log('Rebuilding', event.input)
    if (event.code === 'END') {
      if (watchMode) console.log('Done\n')
      else watcher.close()
    }
  })
  return watcher
}

watch()

function getFileList (dir) {
  const fileList = []
  const files = fs.readdirSync(dir)
  files.forEach(file => {
    const f = path.join(dir, file)
    if (fs.statSync(f).isDirectory()) {
      fileList.push(...getFileList(f))
    } else {
      fileList.push(f)
    }
  })
  return fileList
}
