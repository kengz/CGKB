const spacyNLP = require('spacy-nlp')
/* istanbul ignore next */
process.env.IOPORT = process.env.IOPORT || 6466

/* istanbul ignore next */
if (require.main === module) {
  spacyNLP.server({ port: process.env.IOPORT })
}
