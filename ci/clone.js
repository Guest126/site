#!/usr/bin/env node
const { join } = require('path')
const { execSync } = require('child_process')
const fs = require('fs')
const getRepos = require('./helpers/get_repos')
const co = require('co')

process.chdir(join(__dirname, '..'))

const org = 'profession-of-faith-jp'

co(function * () {
  let repos = yield getRepos(org)
  let cloned = fs.readdirSync('repos')

  // Clone all github repository
  for (let repo of repos) {
    if (cloned.includes(repo)) {
      continue
    }
    let command = `git clone https://github.com/${org}/${repo}.git`
    console.log('>', command)
    let out = execSync(command, {
      cwd: join(__dirname, '../repos')
    }).toString()
    console.log(out)
  }
})
