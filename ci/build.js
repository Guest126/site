#!/usr/bin/env node
const { execSync } = require('child_process')
const { join } = require('path')
const fs = require('fs')
const co = require('co')
const buildHtml = require('./helpers/build-html')
const buildCSS = require('./helpers/build-css')

co(function * () {
  let repository = process.argv[2]
  if (!repository) {
    showUsage()
    process.exit(0)
  }

  let out = execSync('git pull', { cwd: join(__dirname, `../repos/${repository}`) })
  console.log(out.toString())

  // --- Build HTML ---

  let config = require(`../repos/${repository}/config.json`)
  let { title } = config

  let names = fs.readdirSync(join(__dirname, `../repos/${repository}/src`))
  let markdowns = names.map((name) => ({
    path: join(__dirname, `../repos/${repository}/src/${name}`),
    name
  })).filter(({ path }) => fs.existsSync(path))
  let distDir = join(__dirname, `../docs/${repository}`)
  yield buildHtml({title, markdowns, distDir, repository})

  // --- Build CSS ---

  let cssDistDir = join(__dirname, `../docs/${repository}/css`)
  yield buildCSS(cssDistDir)
}).catch(e => console.error(e))

function showUsage () {
  console.log(`
Build repository in the PFJ project.
Usage:
  $ ./ci/build.js $repository_name
`)
}
