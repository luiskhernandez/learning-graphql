const {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} = require('graphql');

const queryType =  new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => 'world'
    }
  }
});
const mySchema = new GraphQLSchema({
  query: queryType
});

module.exports = mySchema;
