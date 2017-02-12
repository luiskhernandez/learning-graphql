const {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} = require('graphql');

const faker = require('faker')
const prefix = ['US','DE']

const random = n => {
  return Math.floor(Math.random() * n) +1
}

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
      resolve(parent, args) {
        return cards.filter((card) => card.ownwer_id == parent.id)
      }
    }
  })
});

const cardType  = new GraphQLObjectType({
  name: 'cardType',
  description: 'card in the system',
  fields : {
    id: {
      type: GraphQLID,
      description: 'The id of the video'
    },
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
    owner: {
      type: User,
      description: 'Owner',
      resolve (parent) {
        return users.find((item) => item.id == parent.ownwer_id)
      }
    }
  }
})

const cards =Array.from(Array(50)).map((item, i) => {
  const number = random(5)
  return {
    id: i,
    ownwer_id: i % 2,
    estimate: random(13),
    description: faker.lorem.sentences(number),
    title: `${prefix[random(1)]}${random(3000)}`
  }
})
const users =Array.from(Array(10)).map((item, i) => {
  const number = random(5)
  return {
    id: i,
    avatar: faker.image.avatar(),
    name: faker.name.findName()
  }
})

const queryType = new GraphQLObjectType({
  name: 'RootQuery',
  description: 'The root query type',
  fields: {
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
        return cards.find((card) => card.id == args.id)
      }
    },
    cards: {
      type: new GraphQLList(cardType),
      description: 'List of cards',
      resolve: () => {
        return cards
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
