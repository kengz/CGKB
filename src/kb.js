const Promise = require('bluebird')
const _ = require('lodash')
const path = require('path')
const db = require(path.join(__dirname, 'db'))

// suggested prop keys
var prop = {
  label: 'entity type:, PERSON etc. Easy for edge visualization',
  name: 'easy for node visualization'
  type: 'data type',
  // <any key>: as long as you keep track of the schema
}

// -------------------------------------------------------------
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

function filterize(prop, propName = 'prop') {
  return `${labelize(prop.label)} ${literalize(prop, propName)}`
}

function updateLabel(findProp, setProp) {
  var findLabel = labelize(findProp.label)
  var setLabel = labelize(setProp.label)
  if (findLabel && findLabel !== setLabel) {
    return `REMOVE a${findLabel} SET a${setLabel}`
  } else {
    return ''
  }
}

function updateEdgeLabel(findProp, setProp) {
  var findLabel = labelize(findProp.label)
  var setLabel = labelize(setProp.label)
  if (findLabel && findLabel !== setLabel) {
    return `CREATE (a)-[e2${setLabel}]->(b) SET e2 = e WITH e, e2 DELETE e RETURN e2`
  } else {
    return 'RETURN e'
  }
}

// -------------------------------------------------------------
// CRUD methods for Node, Edge, Graph(no updateGraph cuz it makes no sense)

// will not add duplicates, but update if already added
function addNode(prop, timestamp = new Date().toJSON()) {
  var query = `MERGE (a${filterize(prop)}) ON CREATE SET a={prop}, a.created_at=${JSON.stringify(timestamp)}, a.updated_at=${JSON.stringify(timestamp)} ON MATCH SET a += {prop}, a.updated_at=${JSON.stringify(timestamp)} RETURN a`
  return {
    query: query,
    params: { prop: prop }
  }
}

function getNode(prop) {
  var query = `MATCH (a${filterize(prop)}) RETURN a`
  return {
    query: query,
    params: { prop: prop }
  }
}

function updateNode(findProp, setProp, timestamp = new Date().toJSON()) {
  var query = `MATCH (a${filterize(findProp, "findProp")}) SET a += {setProp}, a.updated_at=${JSON.stringify(timestamp)} ${updateLabel(findProp, setProp)} RETURN a`
  return {
    query: query,
    params: { findProp: findProp, setProp: setProp }
  }
}

function removeNode(prop) {
  var query = `MATCH (a${filterize(prop)}) DETACH DELETE a`
  return {
    query: query,
    params: { prop: prop }
  }
}

// shall create edge only, thus if fail to find nodes, give up
// creating edge and node together is the job of a graph op instead
function addEdge(propFrom, propTo, prop, timestamp = new Date().toJSON()) {
  var query = `MATCH (a${filterize(propFrom, 'propFrom')}), (b${filterize(propTo, 'propTo')}) MERGE (a)-[e${filterize(prop, 'prop')}]->(b) ON CREATE SET e={prop}, e.created_at=${JSON.stringify(timestamp)}, e.updated_at=${JSON.stringify(timestamp)} ON MATCH SET e += {prop}, e.updated_at=${JSON.stringify(timestamp)} RETURN e`
  return {
    query: query,
    params: { propFrom: propFrom, propTo: propTo, prop: prop }
  }
}

function getEdge(propFrom, propTo, prop) {
  var query = `MATCH (a${filterize(propFrom, 'propFrom')})-[e${filterize(prop, 'prop')}]->(b${filterize(propTo, 'propTo')}) RETURN e`
  return {
    query: query,
    params: { propFrom: propFrom, propTo: propTo, prop: prop }
  }
}

function updateEdge(propFrom, propTo, findProp, setProp, timestamp = new Date().toJSON()) {
  var query = `MATCH (a${filterize(propFrom, 'propFrom')})-[e${filterize(findProp, 'findProp')}]->(b${filterize(propTo, 'propTo')}) SET e += {setProp}, e.updated_at=${JSON.stringify(timestamp)} ${updateEdgeLabel(findProp, setProp)}`
  return {
    query: query,
    params: { propFrom: propFrom, propTo: propTo, findProp: findProp, setProp: setProp }
  }
}

function removeEdge(propFrom, propTo, prop) {
  var query = `MATCH (a${filterize(propFrom, 'propFrom')})-[e${filterize(prop, 'prop')}]->(b${filterize(propTo, 'propTo')}) DELETE e`
  return {
    query: query,
    params: { propFrom: propFrom, propTo: propTo, prop: prop }
  }
}

// propTriple: from, to, edge, so edge can be left out for default later
function addGraph(propTriples, timestamp = new Date().toJSON()) {
  var queries = _.flatMap(propTriples, (propTriple) => {
    var [propFrom, propTo, prop] = propTriple
    return [
      addNode(propFrom, timestamp),
      addNode(propTo, timestamp),
      addEdge(propFrom, propTo, prop, timestamp)
    ]
  })
  return queries
}

function getGraph(propTriples) {
  var queries = _.flatMap(propTriples, (propTriple) => {
    var [propFrom, propTo, prop] = propTriple
    return [
      getNode(propFrom),
      getNode(propTo),
      getEdge(propFrom, propTo, prop)
    ]
  })
  return queries
}

// makes no sense
// function updateGraph() {}

// need only specify the nodes to delete a graph
function removeGraph(nodeProps) {
  var queries = _.map(nodeProps, removeNode)
  return queries
}

// -------------------------------------------------------------
// clear DB: whole or test only

// a good idea to separate them into indep script
function clearDb() {
  return db.cypherAsync(`MATCH (u) DETACH DELETE u`)
}

function clearTestDb() {
  return db.cypherAsync(`MATCH (a) WHERE ANY(x IN labels(a) WHERE x =~ "(?i)^test_.*") DETACH DELETE a`)
}

// clearDb()
//   .then(console.log)

// -------------------------------------------------------------
// demo

var propA = { name: "Alice", email: "alice@example.com", label: "PERSON" }
var propB = { name: "Bob", email: "bob@example.com", label: "PERSON" }
var propAB = { name: "love-love", label: "LOVE" }
var propBA = { name: "friend-love", label: "LOVE" }
var graph = [
  [propA, propB, propAB],
  [propB, propA, propBA]
]

// var qp = addGraph(graph)
// var qp = getGraph(graph)
// var qp = removeGraph([propA, propB])

db.cypherAsync(qp)
  .then((res) => {
    console.log(res)
  })

// var label = "PERSON"
// var prop = { name: "Alice", email: "alice@example.com", label: label }
// var setProp = { name: "Alice", email: "bob@example.com", label: "STORY" }
// var timestamp = new Date().toJSON()
// var edgeProp = { name: "Evolution", label: "BECOME" }
// var setEdgeProp = { name: "Devolution", label: "WAS" }

// ohh shit allow for label update too
// var qp = addNode(prop, timestamp)
// var qp = getNode(prop)
// var qp = removeNode(prop)
// var qp = updateNode(prop, setProp, timestamp)
// var qp = addEdge(prop, setProp, edgeProp)
// var qp = getEdge(prop, setProp, edgeProp)
// var qp = updateEdge(prop, setProp, edgeProp, setEdgeProp)
// var qp = removeEdge(prop, setProp, {})
// console.log(qp)

// db.cypherAsync(qp)
//   .then((res) => {
//     console.log(res)
//   })


// yeah can make a direct parse tree in graph
// var parseTrees = [{
//   "word": "like",
//   "lemma": "like",
//   "NE": "",
//   "POS_fine": "VBP",
//   "POS_coarse": "VERB",
//   "arc": "ROOT",
//   "modifiers": [{
//     "word": "I",
//     "lemma": "i",
//     "NE": "",
//     "POS_fine": "PRP",
//     "POS_coarse": "PRON",
//     "arc": "nsubj",
//     "modifiers": []
//   }, {
//     "word": "apple",
//     "lemma": "apple",
//     "NE": "",
//     "POS_fine": "NN",
//     "POS_coarse": "NOUN",
//     "arc": "dobj",
//     "modifiers": []
//   }, {
//     "word": ".",
//     "lemma": ".",
//     "NE": "",
//     "POS_fine": ".",
//     "POS_coarse": "PUNCT",
//     "arc": "punct",
//     "modifiers": []
//   }]
// }]
