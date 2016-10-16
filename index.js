const path = require('path')
const kb = require(path.join(__dirname, 'src', 'kb'))
const nlp = require(path.join(__dirname, 'src', 'nlp'))
const nlpServer = require(path.join(__dirname, 'src', 'nlp-server'))

module.exports = {
  kb: kb,
  nlp: nlp,
  nlpServer: nlpServer
}


// -------------------------------------------------------------
// demo

// suggested prop keys
// var prop = {
//   label: 'entity type:, PERSON etc. Easy for edge visualization',
//   name: 'easy for node visualization',
//   type: 'data type',
//   // <any key>: as long as you keep track of the schema
// }

// var propA = { name: "Alice", email: "alice@example.com", label: "PERSON" }
// var propB = { name: "Bob", email: "bob@example.com", label: "PERSON" }
// var propAB = { name: "love-love", label: "LOVE" }
// var propBA = { name: "friend-love", label: "LOVE" }
// var graph = [
//   [propA, propB, propAB],
//   [propB, propA, propBA]
// ]

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
