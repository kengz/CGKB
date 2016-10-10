const Promise = require('bluebird')
const _ = require('lodash')
const path = require('path')
const db = require(path.join(__dirname, 'db'))

var prop = {
  // label: 'entity type:, PERSON etc. Easy for edge visualization',
  created_at: 'ISO',
  updated_at: 'ISO',
  type: 'data type',
  name: 'easy for node visualization'
    // <any key>: as long as you keep track of the schema
}

// console.log(prop)
// timestamp = _.pick(prop, 'created_at')
// _.unset(prop, 'created_at')
// console.log(prop)


// helpers

function literalize(prop, propName = 'prop') {
  if (!prop) {
    return ''
  }
  var litArr = _.map(prop, function(_v, k) {
    return `${k}: {${propName}}.${k}`
  })
  return `{${litArr.join(', ')}}`
}

function labelize(label) {
  if (_.isArray(label)) {
    return `:${label.join(':')}`
  }
  label = _.toString(label)
  return (!label) ? '' : `:${label}`
}

function labelizeUpdate(findProp, setProp) {
  var findLabel = labelize(findProp.label)
  var setLabel = labelize(setProp.label)
  if (findLabel && findLabel !== setLabel) {
    return `REMOVE a${findLabel} SET a${setLabel}`
  } else {
    return ''
  }
}

// CRUD methods:
// addNode, removeNode, getNode, updateNode
// addEdge, removeEdge, getEdge, updateEdge
// addGraph, removeGraph, getGraph (compositional from above), updateGraph

function addNode(prop, timestamp = new Date().toJSON()) {
  var query = `MERGE (a${labelize(prop.label)} ${literalize(prop)}) ON CREATE SET a={prop}, a.created_at=${JSON.stringify(timestamp)}, a.updated_at=${JSON.stringify(timestamp)} ON MATCH SET a += {prop}, a.updated_at=${JSON.stringify(timestamp)} RETURN a`
  return {
    query: query,
    params: { prop: prop }
  }
}

function updateNode(findProp, setProp, timestamp = new Date().toJSON()) {
  var query = `MERGE (a${labelize(prop.label)} ${literalize(findProp, "findProp")}) ON CREATE SET a={setProp}, a.created_at=${JSON.stringify(timestamp)}, a.updated_at=${JSON.stringify(timestamp)} ON MATCH SET a += {setProp}, a.updated_at=${JSON.stringify(timestamp)} ${labelizeUpdate(findProp, setProp)} RETURN a`
  return {
    query: query,
    params: { findProp: findProp, setProp: setProp }
  }
}

function getNode(prop) {
  var query = `MATCH (a${labelize(prop.label)} ${literalize(prop)}) RETURN a`
  return {
    query: query,
    params: { prop: prop }
  }
}

function removeNode(prop) {
  var query = `MATCH (a${labelize(prop.label)} ${literalize(prop)}) DETACH DELETE a`
  return {
    query: query,
    params: { prop: prop }
  }
}


// function addEdge(propA, propB, propE, timestamp = new Date().toJSON()) {}
// function updateEdge() {}
// function getEdge() {}
// function removeEdge() {}


var label = "PERSON"
var prop = { name: "Alice", email: "alice@example.com", label: label }
var setProp = { name: "Alice", email: "bob@example.com", label: "STORY" }
var timestamp = new Date().toJSON()

// ohh shit allow for label update too
// var qp = addNode(prop, timestamp)
// var qp = updateNode(prop, setProp, timestamp)
// var qp = removeNode(prop)
// console.log(qp)

// db.cypherAsync(qp)
//   .then((res) => {
//     console.log(res)
//   })

// a good idea to separate them into indep script
function clearDb() {
  return db.cypherAsync(`MATCH (u) DETACH DELETE u`)
}

function clearTestDb() {
  return db.cypherAsync(`MATCH (a) WHERE ANY(x IN labels(a) WHERE x =~ "(?i)^test_.*") DETACH DELETE a`)
}

// clearDb()
//   .then(console.log)

var parseTrees = [{
  "word": "like",
  "lemma": "like",
  "NE": "",
  "POS_fine": "VBP",
  "POS_coarse": "VERB",
  "arc": "ROOT",
  "modifiers": [{
    "word": "I",
    "lemma": "i",
    "NE": "",
    "POS_fine": "PRP",
    "POS_coarse": "PRON",
    "arc": "nsubj",
    "modifiers": []
  }, {
    "word": "apple",
    "lemma": "apple",
    "NE": "",
    "POS_fine": "NN",
    "POS_coarse": "NOUN",
    "arc": "dobj",
    "modifiers": []
  }, {
    "word": ".",
    "lemma": ".",
    "NE": "",
    "POS_fine": ".",
    "POS_coarse": "PUNCT",
    "arc": "punct",
    "modifiers": []
  }]
}]
