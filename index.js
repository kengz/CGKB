const path = require('path')
const kb = require(path.join(__dirname, 'src', 'kb'))

module.exports = kb


// -------------------------------------------------------------
// demo

// suggested prop keys
// var prop = {
//   label: 'entity type:, PERSON etc. Easy for edge visualization',
//   name: 'easy for node visualization',
//   type: 'data type',
//   // <any key>: as long as you keep track of the schema
// }

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

// db.cypherAsync(qp)
//   .then((res) => {
//     console.log(res)
//   })

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

const _ = require('lodash')

// yeah can make a direct parse tree in graph
var parseTree = [{
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


var nodeROOT = {
  word: "ROOT",
  POS_fine: "ROOT"
}

function graphifyParseTree(parseTree, nodeFrom = nodeROOT, graph = []) {
  nodeFrom['name'] = nodeFrom['word']
  nodeFrom['label'] = nodeFrom['POS_fine']
  _.each(parseTree, (nodeTo) => {
    // take out modifiers
    var modifiers = _.get(nodeTo, 'modifiers')
    _.remove(modifiers, (n) => {
      return n['POS_coarse'] == 'PUNCT'
    })
    _.unset(nodeTo, 'modifiers')
    nodeTo['name'] = nodeTo['word']
    nodeTo['label'] = nodeTo['POS_fine']
    edge = { label: nodeTo['arc'] }
    graph.push([nodeFrom, nodeTo, edge])
    graphifyParseTree(modifiers, nodeTo, graph)
  })
  return graph
}

graph = graphifyParseTree(parseTree, nodeROOT)
console.log(graph)

// clearDb()
//   .then(console.log)

var qp = kb.addGraph(graph)
  // var qp = getGraph(graph)
  // var qp = removeGraph([propA, propB])

// console.log(qp)
kb.db.cypherAsync(qp)
  .then((res) => {
    console.log(res)
  })
