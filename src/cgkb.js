const co = require('co')
const path = require('path')
const kb = require(path.join(__dirname, 'kb'))
const nlp = require(path.join(__dirname, 'nlp'))
const nlpServer = require(path.join(__dirname, 'nlp-server'))

// the root node for the graph
var rootNode = {
  word: "ROOT",
  POS_fine: "ROOT",
  POS_coarse: "ROOT"
}

// set name for visualization, and label
function setNameAndLabel(node) {
  node['name'] = node['word']
  node['label'] = node['POS_coarse'] == 'PUNCT' ? 'PUNCT' : node['POS_fine'] // words only
  return node
}

function makeEdge(nodeTo) {
  edge = { label: nodeTo['arc'] }
  return edge
}

// format the nlp parse tree to graph
function parseTreeToGraph(parseTree, nodeFrom = rootNode, graph = []) {
  setNameAndLabel(nodeFrom)
  _.each(parseTree, (nodeTo) => {
    // take out modifiers
    var modifiers = _.get(nodeTo, 'modifiers')
    _.unset(nodeTo, 'modifiers')
    setNameAndLabel(nodeTo)
    edge = makeEdge(nodeTo)
    graph.push([nodeFrom, nodeTo, edge])
    parseTreeToGraph(modifiers, nodeTo, graph)
  })
  return graph
}

// add knowledge to kb
var add = co.wrap(function*(text) {
  var outputs = yield nlp.parse(text)
  graphs = _.map(outputs, (o) => {
    parseTree = o.parse_tree
    graph = parseTreeToGraph(parseTree, rootNode)
    qp = kb.addGraph(graph)
    return qp
  })
  return yield kb.db.cypherAsync(graphs)
})

module.exports = {
  kb: kb,
  nlp: nlp,
  nlpServer: nlpServer,
  add: add
}

