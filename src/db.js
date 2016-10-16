const Promise = require('bluebird')
const _ = require('lodash')
const neo4j = require('neo4j')
const path = require('path')
const dbEnvConfig = require(path.join(__dirname, '..', 'config', 'db.json'))

/* istanbul ignore next */
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.TZ = 'utc' // standardize db time
const dbConfig = _.get(dbEnvConfig, `${process.env.NODE_ENV}`)
const db = new neo4j.GraphDatabase(`http://${dbConfig.username}:${dbConfig.password}@localhost:7474`)
Promise.promisifyAll(db)

module.exports = db
