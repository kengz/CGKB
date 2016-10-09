const polyIO = require('poly-socketio')
polyIO.gClient({ port: 6466 })

var msg = {
  input: 'I like apple',
  to: 'nlp.py',
  intent: 'parse'
}
global.client.pass(msg)
  .then((reply) => {
    console.log(reply)
  })
