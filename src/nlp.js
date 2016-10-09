// assuming server is starte and ready
const polyIO = require('poly-socketio')
process.env.IOPORT = process.env.IOPORT || 6466
polyIO.gClient({ port: process.env.IOPORT })

function parse(inputStr) {
  var msg = {
    input: inputStr,
    to: 'nlp.cgkb-py',
    intent: 'parse'
  }
  return global.client.pass(msg)
    .then((reply) => {
      return reply.output
    })
}

// parse('Bob Brought the pizza to Alice.')
//   .then((output) => {
//     console.log(output)
//     console.log(JSON.stringify(output[0].parse_tree, null, 2))
//       // console.log(JSON.stringify(output[0].parse_list, null, 2))
//   })

module.exports = {
  parse: parse
}
