const Promise = require('bluebird')
const chai = require('chai')
const should = chai.should()
const polyIO = require('poly-socketio')
const startIO = require('../src/start-io')

describe('start poly-socketio', () => {
  var ioPromise = startIO()

  it('resolve global.ioPromise when all joined', () => {
    globalClient = polyIO.gClient({ port: process.env.IOPORT })
    return ioPromise
  })
})
