const { MongoClient } = require('mongodb');
const { graphql } = require('graphql');
const readline = require('readline');
const assert = require('assert');
const express = require('express');
const app = express();
const graphqlHTTP = require('express-graphql');

const MONGO_URL = 'mongodb://localhost:27017/test';

const mySchema = require('./schema/main');

const rli = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

MongoClient.connect(MONGO_URL, (err, db) => {
  assert.equal(null, err);
  console.log('Connected to MongoDB server');

  // rli.question('Client Request: ', inputQuery => {
  //   graphql(mySchema, inputQuery, {}, { db }).then(result => {
  //     console.log('Server Answer: ', result.data)
  //     db.close( () => rli.close());
  //   })

  //   rli.close();
  // })

  app.use('/graphql', graphqlHTTP({
    schema: mySchema,
    context: { db }
  }));
  app.use('/ui', graphqlHTTP({
    schema: mySchema,
    context: { db },
    graphiql: true
  }));
  app.listen(4000, () => console.log('Running Express.js on port 4000'))
});


