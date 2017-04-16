const request = require('request-promise')
const co = require('co')

const ignoreRepos = [
  'site',
  'pfj-tools'
]

/**
 * Get repository names
 */
function getRepos (org) {
  return co(function * () {
    let repos = yield request({
      method: 'GET',
      json: true,
      url: `https://api.github.com/orgs/${org}/repos`,
      headers: {
        'User-Agent': 'request'
      }
    })
    let names = repos.map(({ name }) => name).filter(name => !ignoreRepos.includes(name))
    return names
  })
}

module.exports = getRepos
