const {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} = require('graphql');

const GraphQLRelay = require('graphql-relay')

function truncate(str, max) {
  return str.split(" ").splice(0,max).join(" ") + '…'
}

var nodeDefinitions = GraphQLRelay.nodeDefinitions(function(globalId) {
  var idInfo = GraphQLRelay.fromGlobalId(globalId)
  if (idInfo.type == 'User') {
    return users.find((user) => user.id == idInfo.id)
  } else if (idInfo.type == 'cardType') {
    return cards.find((card) => card.id == idInfo.id)
  }
  return null
})

const faker = require('faker')
const prefix = ['US','DE']
const card_states = ['icebox', 'backlog', 'in_progress', 'completed','accepted', 'deployed' ]

const random = n => {
  return Math.floor(Math.random() * n) +1
}

const User = new GraphQLObjectType({
  name: 'User',
  isTypeOf: (obj) => {
    return obj.type == 'User'
  },
  fields: () => ({
    id: GraphQLRelay.globalIdField('User'),
    name: {
      type: GraphQLString,
      description: 'owner'
    },
    avatar: {
      type: GraphQLString,
      description: 'Owner avatar',
    },
    cards: {
      type: GraphQLRelay.connectionDefinitions({name: 'Card', nodeType: cardType}).connectionType,
      args: Object.assign(GraphQLRelay.connectionArgs, {
        state:{
          type: GraphQLString,
          description: 'Card state'
        }
      }
      ),
      resolve(parent, args) {
        let user_cards = cards.filter((card) => card.owner_id == parent.id)
        if (args.hasOwnProperty('state')) {
          user_cards = user_cards.filter((card) => card.state == args.state)
        }
        return GraphQLRelay.connectionFromArray(user_cards, args)
      }
    }
  }),
  interfaces: [nodeDefinitions.nodeInterface]
});

const cardType  = new GraphQLObjectType({
  name: 'cardType',
  description: 'card in the system',
  isTypeOf: (obj) => {
    return obj.type == 'Card'
  },
  fields : {
    id: GraphQLRelay.globalIdField('cardType'),
    description: {
      type: GraphQLString,
      description: 'card description',
      args: {
        limit: {
          type: GraphQLInt,
          defaultValue: 10
        }
      },
      resolve (parent, args) {
        return truncate(parent.description, args.limit)
      }
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
  },
  interfaces: [nodeDefinitions.nodeInterface]
})

const cards =Array.from(Array(50)).map((item, i) => {
  const number = random(5)
  return {
    id: i,
    owner_id: 1,
    estimate: random(13),
    description: faker.lorem.sentences(30),
    title: `${i}-${prefix[random(1)]}${random(3000)}`,
    type: 'Card',
    state: `${card_states[random(card_states.length)]}`,
  }
})

const users =Array.from(Array(10)).map((item, i) => {
  const number = random(5)
  return {
    id: i,
    avatar: faker.image.avatar(),
    name: faker.name.findName(),
    type: 'User'
  }
})

const queryType = new GraphQLObjectType({
  name: 'RootQuery',
  description: 'The root query type',
  fields: {
    node: nodeDefinitions.nodeField,
    usersCount: {
      type: GraphQLInt,
      resolve: (_, args, { db }) => db.collection('users').count()
    },
    hello: {
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
        let rolls = []
        for (let i = 0; i < args.count; i++) {
          rolls.push(roll());
        }
        return rolls;
      }
    },
    card: {
      type: cardType,
      args: {
        id: {
          type: GraphQLID,
          description: 'Id of the video'
        }
      },
      resolve: (_, args) => {
        console.log(args, cards)
        return cards.find((card) => card.id == args.id)
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

const roll = () => Math.floor(6 * Math.random()) + 1;

const mySchema = new GraphQLSchema({
  query: queryType
});

module.exports = mySchema;
