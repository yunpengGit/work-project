if (process.env.NODE_ENV !== 'production') {
  const Mock = require('mockjs')
  require('./user')
  Mock.setup({
    timeout: 666
  })
}
