#!/usr/bin/env node
const { execSync } = require('child_process')
const { join } = require('path')
const fs = require('fs')
const co = require('co')
const buildHtml = require('./helpers/build-html')

co(function * () {
  let repository = process.argv[2]
  if (!repository) {
    showUsage()
    process.exit(0)
  }

  let out = execSync('git pull', { cwd: join(__dirname, `../repos/${repository}`) })
  console.log(out.toString())

  console.log('')
  console.log('Build...')
  // --- Build HTML ---

  let names = fs.readdirSync(join(__dirname, `../repos/${repository}/src`))
  let markdowns = names.map((name) => ({
    path: join(__dirname, `../repos/${repository}/src/${name}`),
    name
  })).filter(({ path }) => fs.existsSync(path))
  let distDir = join(__dirname, `../docs/articles`)
  yield buildHtml(markdowns, distDir, repository)

  console.log('Done.')
}).catch(e => console.error(e))

function showUsage () {
  console.log(`
Build repository in the PFJ project.
Usage:
  $ ./ci/build.js $repository_name
`)
}
