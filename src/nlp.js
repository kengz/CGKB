const spacyNLP = require('spacy-nlp')
const nlp = spacyNLP.nlp

// Note you can pass multiple sentences concat in one string.
nlp.parse('Bob Brought the pizza to Alice.')
  .then((output) => {
    console.log(output)
    // console.log(JSON.stringify(output[0].parse_tree, null, 2))
  })
