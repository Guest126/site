#!/usr/bin/env node
const getRepos = require('./helpers/get_repos')

getRepos('profession-of-faith-jp').then(names => {
  for (let name of names) {
    console.log(name)
  }
})
