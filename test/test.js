const Promise = require('bluebird')
const chai = require('chai')
const should = chai.should()
const cgkb = require('../index')

describe('DB auth', () => {
  cgkb.db

  it('should pass', () => {
    (1).should.eq(1)
  })
})
