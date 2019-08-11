const deepmerge = require('deepmerge')

module.exports = deepmerge(require('./eslint/common.js'), {
    env: {
        node: true
    }
})