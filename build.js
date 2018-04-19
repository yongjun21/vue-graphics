const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const rollup = require('rollup')

const fileList = getFileList('src/components').filter(file => /\.js$/.test(file))

async function build () {
  for (let file of fileList) {
    try {
      const bundle = await rollup.rollup({input: file})
      const filename = file.replace(/^src/, 'dist')
      const dir = filename.match(/(.+)\//)[1]
      mkdirp.sync(dir)
      const {code} = await bundle.generate({format: 'es'})
      fs.writeFileSync(filename, code)
    } catch (err) {
      console.error(err)
    }
  }
}

build()

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
