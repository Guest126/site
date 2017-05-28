const marked = require('marked')
const fs = require('fs')
const co = require('co')
const addToc = require('./add-toc')

let renderer = new marked.Renderer()
renderer.heading = (text, level) => `<h${level} id="${text}">${text}</h${level}>\n`
marked.setOptions({
  gmf: true,
  breaks: true,
  renderer
})

/**
 * markdown ファイルを html 文字列に変換する。
 * @returns Promise<string>
 */
function mdToHtml (path) {
  return co(function * () {
    let markdown = (yield new Promise((resolve, reject) => {
      fs.readFile(path, (err, res) => err ? reject(err) : resolve(res))
    })).toString()
    let html = marked(addToc(markdown))
    return html
  })
}

if (!module.parent) {
  mdToHtml(`${__dirname}/../../tmp/test.md`)
  .then(d => console.log(d))
}

module.exports = mdToHtml
