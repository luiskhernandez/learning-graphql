const { graphql } = require('graphql');
const express = require('express');
const app = express();
const graphqlHTTP = require('express-graphql');

const mySchema = require('./schema/main');

app.use('/ui', graphqlHTTP({
  schema: mySchema,
  graphiql: true,
  context: {
    current_user: 1
  }
}));

app.listen(4000, () => console.log('Running Express.js on port 4000'))
