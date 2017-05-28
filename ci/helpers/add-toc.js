const toc = require('markdown-toc')
const encode = require('urlencode')

function _insertToc (mdText, content) {
  let split = mdText.split('\n')
  split.splice(1, 0, content)
  return split.join('\n')
}

function addToc (mdText) {
  let titles = toc(mdText).json
  let subTitles = titles.filter(t => t.lvl === 2)
  if (subTitles.length === 0) {
    return mdText
  }
  let content = subTitles.map(({ content }) => `- [${content}](#${encode(content)})\n`).join('')
  let inserted = _insertToc(mdText, content)
  return inserted
}

if (!module.parent) {
  const { readFileSync } = require('fs')
  let mdText = readFileSync(`${__dirname}/../../tmp/test.md`).toString()
  console.log(addToc(mdText))
}

module.exports = addToc
