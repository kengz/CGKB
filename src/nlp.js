const polyIO = require('poly-socketio')
polyIO.gClient({ port: 6466 })

var msg = {
  input: 'Bob Brought the pizza to Alice. I saw the man with glasses.',
  // input: 'I saw the man with glasses.',
  // input: 'I am eating an apple.',
  to: 'nlp.py',
  intent: 'parse'
  // intent: 'parsedoc'
  // intent: 'NER_POS_tree'
}
global.client.pass(msg)
  .then((reply) => {
    console.log(JSON.stringify(reply.output[0].POS_tree, null, 2))
    console.log(JSON.stringify(reply.output[0].POS_tag, null, 2))
    console.log(reply)
  })
