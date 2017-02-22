const { graphql } = require('graphql');
const readline = require('readline');
const assert = require('assert');
const express = require('express');
const app = express();
const graphqlHTTP = require('express-graphql');
const cors = require('cors');

const mySchema = require('./schema/main');

const rli = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

app.post('/graphql', cors(), graphqlHTTP({
  schema: mySchema,
  context: {
    current_user: 1
  }
}));

app.use('/graphql', cors(),graphqlHTTP({
  schema: mySchema,
  context: {
    current_user: 1
  }
}));

app.use('/ui', graphqlHTTP({
  schema: mySchema,
  graphiql: true,
  context: {
    current_user: 1
  }
}));

app.listen(4000, () => console.log('Running Express.js on port 4000'))
