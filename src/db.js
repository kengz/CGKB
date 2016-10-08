const Promise = require('bluebird')
const _ = require('lomath')
const neo4j = require('neo4j')
const path = require('path')
const dbEnvConfig = require(path.join(__dirname, '..', 'config', 'db.json'))

/* istanbul ignore next */
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const dbConfig = _.get(dbEnvConfig, `${process.env.NODE_ENV}`)
const db = new neo4j.GraphDatabase(`http://${dbConfig.username}:${dbConfig.password}@localhost:7474`)
Promise.promisifyAll(db)

// db.cypher({
//     query: 'MATCH (u:User {email: {email}}) RETURN u',
//     params: {
//         email: 'alice@example.com',
//     },
// }, function (err, results) {
//     if (err) throw err;
//     var result = results[0];
//     if (!result) {
//         console.log('No user found.');
//     } else {
//         var user = result['u'];
//         console.log(JSON.stringify(user, null, 4));
//     }
// });

module.exports = db
