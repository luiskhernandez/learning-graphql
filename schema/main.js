const {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} = require('graphql');

const { cards, roll, users } = require('./data')

const User = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: GraphQLID
    },
    name: {
      type: GraphQLString,
      description: 'owner'
    },
    avatar: {
      type: GraphQLString,
      description: 'Owner avatar',
    },
    cards: {
      type: new GraphQLList(cardType),
      args: {
        state:{
          type: GraphQLString,
          description: 'Card state'
        }
      }
      ,
      resolve(parent, args) {
        let user_cards = cards.filter((card) => card.owner_id == parent.id)
        if (args.hasOwnProperty('state')) {
          user_cards = user_cards.filter((card) => card.state == args.state)
        }
        return user_cards
      }
    }
  }),
});

const cardType  = new GraphQLObjectType({
  name: 'cardType',
  description: 'card in the system',
  isTypeOf: (obj) => {
    return obj.type == 'Card'
  },
  fields : {
    id:{
      type: GraphQLID
    } ,
    description: {
      type: GraphQLString,
      description: 'card description',
    },
    title: {
      type: GraphQLString,
      description: 'title',
    },
    estimate: {
      type: GraphQLInt,
      description: 'estimate',
    },
    imageUrl: {
      type: GraphQLString,
      description: 'card image',
    },
    state: {
      type: GraphQLString,
      description: 'card state',
    },
    owner: {
      type: User,
      description: 'Owner',
      resolve (parent) {
        return users.find((item) => item.id == parent.owner_id)
      }
    }
  }
})

const queryType = new GraphQLObjectType({
  name: 'RootQuery',
  description: 'The root query type',
  fields: {
    hello: {
      description: 'It returns the word WORLD',
      type: GraphQLString,
      resolve: () => 'world'
    },
    diceRoll: {
      type: new GraphQLList(GraphQLInt),
      args: {
        count: {
          type: GraphQLInt,
          defaultValue: 2
        }
      },
      resolve: (_, args) =>{
        return Array(args.count).fill().map((_, i) => roll() );
      }
    },
    card: {
      type: cardType,
      args: {
        id: {
          type: GraphQLID,
          description: 'Id of the card'
        }
      },
      resolve: (_, args) => {
        return cards.find((card) => card.id == args.id)
      }
    },
    cards: {
      type: new GraphQLList(cardType),
      args: {
        state:{
          type: GraphQLString,
          description: 'Card state'
        }
      },
      description: 'List of cards',
      resolve: (_, args) => {
        if (args.hasOwnProperty('state')) {
          return cards.filter((card) => card.state == args.state)
        } else {
          return cards
        }
      }
    },
    viewer: {
      type: User,
      resolve (parent, args, request) {
        return users.find((user) => user.id == request.current_user)
      }
    },
    user: {
      type: User,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve (parent, {id}) {
        return users.find((user) => user.id == id)
      }
    }
  }
});

const mySchema = new GraphQLSchema({
  query: queryType
});

module.exports = mySchema;
